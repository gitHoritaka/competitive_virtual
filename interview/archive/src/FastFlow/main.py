
import argparse
import os

import torch
import yaml
from tqdm import tqdm
#from ignite.contrib import metrics

import FrEIA.framework as Ff
import FrEIA.modules as Fm
import timm
import torch
import torch.nn as nn
import torch.nn.functional as F

import os
from glob import glob

import torch.utils.data
from PIL import Image
import torchvision
from torchvision import transforms
import numpy as np


class MVTecDataset(torch.utils.data.Dataset):
    def __init__(self, root, category, input_size, is_train=True):
        self.image_transform = transforms.Compose(
            [

             transforms.Resize(input_size, Image.ANTIALIAS),
                transforms.ToTensor(),
                transforms.Normalize(mean = [0.485, 0.456, 0.406], std = [0.229, 0.224, 0.225]),
            ]
        )
        if is_train:
            self.image_files = glob(
                os.path.join(root, category, "train", "good", "*.png")
            )
        else:
            self.image_files = glob(os.path.join(root, category, "test", "*", "*.png"))
            
        self.is_train = is_train

    def __getitem__(self, index):
        image_file = self.image_files[index]
        image = Image.open(image_file).convert('RGB')
        image = self.image_transform(image)
        return image

    def __len__(self):
        return len(self.image_files)

class const:
    BATCH_SIZE = 32
    NUM_EPOCHS = 500
    LR = 1e-3
    WEIGHT_DECAY = 1e-5

    LOG_INTERVAL = 10
    EVAL_INTERVAL = 10
    CHECKPOINT_INTERVAL = 10

    CHECKPOINT_DIR = "./fast-flow-logs"

config ={
    "input_size": 224,
    "backbone_name": "wide_resnet50_2",
    "flow_step": 20,
    "hidden_ratio": 0.16,
    "conv3x3_only": False,
}


def subnet_conv_func(kernel_size, hidden_ratio):
    def subnet_conv(in_channels, out_channels):
        hidden_channels = int(in_channels * hidden_ratio)
        return nn.Sequential(
            nn.Conv2d(in_channels, hidden_channels, kernel_size, padding="same"),
            nn.ReLU(),
            nn.Conv2d(hidden_channels, out_channels, kernel_size, padding="same"),
        )

    return subnet_conv


def nf_fast_flow(input_chw, conv3x3_only, hidden_ratio, flow_steps, clamp=2.0):
    nodes = Ff.SequenceINN(*input_chw)
    for i in range(flow_steps):
        if i % 2 == 1 and not conv3x3_only:
            kernel_size = 1
        else:
            kernel_size = 3
        nodes.append(
            Fm.AllInOneBlock,
            subnet_constructor=subnet_conv_func(kernel_size, hidden_ratio),
            affine_clamping=clamp,
            permute_soft=False,
        )
    return nodes


class FastFlow(nn.Module):
    def __init__(
        self,
        backbone_name,
        flow_steps,
        input_size,
        conv3x3_only=False,
        hidden_ratio=1.0,
    ):
        super(FastFlow, self).__init__()

        #self.feature_extractor = timm.create_model(backbone_name, pretrained=True)
        
        self.init_features()
        def hook_t(module, input, output):
            self.features.append(output)

        #self.model = torch.hub.load('pytorch/vision:v0.9.0', 'wide_resnet50_2', pretrained=True)
        self.feature_extractor = torchvision.models.wide_resnet50_2()
        self.feature_extractor.layer1[-1].register_forward_hook(hook_t)
        self.feature_extractor.layer2[-1].register_forward_hook(hook_t)
        self.feature_extractor.layer3[-1].register_forward_hook(hook_t)
        #channels = self.feature_extractor.feature_info.channels()
        #scales = self.feature_extractor.feature_info.reduction()
        channels = [256, 512, 1024]
        scales = [4, 8, 16]

        # for transformers, use their pretrained norm w/o grad
        # for resnets, self.norms are trainable LayerNorm
        self.norms = nn.ModuleList()
        for in_channels, scale in zip(channels, scales):
            self.norms.append(
                nn.LayerNorm(
                    [in_channels, int(input_size / scale), int(input_size / scale)],
                    elementwise_affine=True,
                )
            )
        for param in self.feature_extractor.parameters():
            param.requires_grad = False

        self.nf_flows = nn.ModuleList()
        for in_channels, scale in zip(channels, scales):
            self.nf_flows.append(
                nf_fast_flow(
                    [in_channels, int(input_size / scale), int(input_size / scale)],
                    conv3x3_only=conv3x3_only,
                    hidden_ratio=hidden_ratio,
                    flow_steps=flow_steps,
                )
            )
        self.input_size = input_size
    
    def init_features(self):
        self.features = []

    def forward(self, x):
        self.feature_extractor.eval()
        # if isinstance(
        #     self.feature_extractor, timm.models.vision_transformer.VisionTransformer
        # ):
        #     x = self.feature_extractor.patch_embed(x)
        #     cls_token = self.feature_extractor.cls_token.expand(x.shape[0], -1, -1)
        #     if self.feature_extractor.dist_token is None:
        #         x = torch.cat((cls_token, x), dim=1)
        #     else:
        #         x = torch.cat(
        #             (
        #                 cls_token,
        #                 self.feature_extractor.dist_token.expand(x.shape[0], -1, -1),
        #                 x,
        #             ),
        #             dim=1,
        #         )
        #     x = self.feature_extractor.pos_drop(x + self.feature_extractor.pos_embed)
        #     for i in range(8):  # paper Table 6. Block Index = 7
        #         x = self.feature_extractor.blocks[i](x)
        #     x = self.feature_extractor.norm(x)
        #     x = x[:, 2:, :]
        #     N, _, C = x.shape
        #     x = x.permute(0, 2, 1)
        #     x = x.reshape(N, C, self.input_size // 16, self.input_size // 16)
        #     features = [x]
        # elif isinstance(self.feature_extractor, timm.models.cait.Cait):
        #     x = self.feature_extractor.patch_embed(x)
        #     x = x + self.feature_extractor.pos_embed
        #     x = self.feature_extractor.pos_drop(x)
        #     for i in range(41):  # paper Table 6. Block Index = 40
        #         x = self.feature_extractor.blocks[i](x)
        #     N, _, C = x.shape
        #     x = self.feature_extractor.norm(x)
        #     x = x.permute(0, 2, 1)
        #     x = x.reshape(N, C, self.input_size // 16, self.input_size // 16)
        #     features = [x]
        # else:
        self.init_features()
        _ = self.feature_extractor(x)
        features = [self.norms[i](feature) for i, feature in enumerate(self.features)]

        loss = 0
        outputs = []
        for i, feature in enumerate(features):
            output, log_jac_dets = self.nf_flows[i](feature)
            loss += torch.mean(
                0.5 * torch.sum(output**2, dim=(1, 2, 3)) - log_jac_dets
            )
            outputs.append(output)
        ret = {"loss": loss}

        if not self.training:
            anomaly_map_list = []
            for output in outputs:
                log_prob = -torch.mean(output**2, dim=1, keepdim=True) * 0.5
                prob = torch.exp(log_prob)
                a_map = F.interpolate(
                    -prob,
                    size=[self.input_size, self.input_size],
                    mode="bilinear",
                    align_corners=False,
                )
                anomaly_map_list.append(a_map)
            anomaly_map_list = torch.stack(anomaly_map_list, dim=-1)
            anomaly_map = torch.mean(anomaly_map_list, dim=-1)
            ret["anomaly_map"] = anomaly_map
        return ret

class AverageMeter:
    """Computes and stores the average and current value"""

    def __init__(self):
        self.reset()

    def reset(self):
        self.val = 0
        self.avg = 0
        self.sum = 0
        self.count = 0

    def update(self, val, n=1):
        self.val = val
        self.sum += val * n
        self.count += n
        self.avg = self.sum / self.count





def build_train_data_loader(args, config):
    train_dataset = MVTecDataset(
        root=args.data,
        category=args.category,
        input_size=(config["input_size"],config["input_size"]),
        is_train=True,
    )
    return torch.utils.data.DataLoader(
        train_dataset,
        batch_size=const.BATCH_SIZE,
        shuffle=True,
        num_workers=1,
        drop_last=True,
    )


def build_test_data_loader(args, config):
    test_dataset = MVTecDataset(
        root=args.data,
        category=args.category,
        input_size=(config["input_size"],config["input_size"]),
        is_train=False,
    )
    return torch.utils.data.DataLoader(
        test_dataset,
        batch_size=const.BATCH_SIZE,
        shuffle=False,
        num_workers=4,
        drop_last=False,
    )


def build_model(config):
    model = FastFlow(
        backbone_name=config["backbone_name"],
        flow_steps=config["flow_step"],
        input_size=config["input_size"],
        conv3x3_only=config["conv3x3_only"],
        hidden_ratio=config["hidden_ratio"],
    )
    print(
        "Model A.D. Param#: {}".format(
            sum(p.numel() for p in model.parameters() if p.requires_grad)
        )
    )
    return model


def build_optimizer(model):
    return torch.optim.Adam(
        model.parameters(), lr=const.LR, weight_decay=const.WEIGHT_DECAY
    )


def train_one_epoch(dataloader, model, optimizer, epoch):
    model.train()
    loss_meter = AverageMeter()
    print("start_training")
    for step, data in enumerate(tqdm(dataloader)):
        # forward
        #data = data.cuda()
        ret = model(data)
        loss = ret["loss"]
        # backward
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        # log
        loss_meter.update(loss.item())
        if (step + 1) % const.LOG_INTERVAL == 0 or (step + 1) == len(dataloader):
            print(
                "Epoch {} - Step {}: loss = {:.3f}({:.3f})".format(
                    epoch + 1, step + 1, loss_meter.val, loss_meter.avg
                )
            )


def eval_once(dataloader, model):
    model.eval()
    auroc_metric = metrics.ROC_AUC()
    for data, targets in dataloader:
        data, targets = data.cuda(), targets.cuda()
        with torch.no_grad():
            ret = model(data)
        outputs = ret["anomaly_map"].cpu().detach()
        outputs = outputs.flatten()
        targets = targets.flatten()
        auroc_metric.update((outputs, targets))
    auroc = auroc_metric.compute()
    print("AUROC: {}".format(auroc))


def train(args):
    os.makedirs(const.CHECKPOINT_DIR, exist_ok=True)
    checkpoint_dir = os.path.join(
        const.CHECKPOINT_DIR, "exp%d" % len(os.listdir(const.CHECKPOINT_DIR))
    )
    os.makedirs(checkpoint_dir, exist_ok=True)

    #config = yaml.safe_load(open(args.config, "r"))
  
    model = build_model(config)
    optimizer = build_optimizer(model)

    train_dataloader = build_train_data_loader(args, config)
    test_dataloader = build_test_data_loader(args, config)
    #model.cuda()

    for epoch in tqdm(range(const.NUM_EPOCHS)):
        print(f"epoch ={epoch} start")
        train_one_epoch(train_dataloader, model, optimizer, epoch)
        #if (epoch + 1) % const.EVAL_INTERVAL == 0:
            #eval_once(test_dataloader, model)
        if (epoch + 1) % const.CHECKPOINT_INTERVAL == 0:
            torch.save(
                {
                    "epoch": epoch,
                    "model_state_dict": model.state_dict(),
                    "optimizer_state_dict": optimizer.state_dict(),
                },
                os.path.join(checkpoint_dir, "%d.pt" % epoch),
            )


def evaluate(args):
    config = yaml.safe_load(open(args.config, "r"))
    model = build_model(config)
    checkpoint = torch.load(args.checkpoint)
    model.load_state_dict(checkpoint["model_state_dict"])
    test_dataloader = build_test_data_loader(args, config)
    model.cuda()
    eval_once(test_dataloader, model)


def parse_args():
    parser = argparse.ArgumentParser(description="Train FastFlow on MVTec-AD dataset")
    parser.add_argument("--data", type=str, default = "./MVTec", help="path to mvtec folder")
    parser.add_argument(
        "-cat",
        "--category",
        type=str,
        default = "screw",
        help="category name in mvtec",
    )
    parser.add_argument("--eval", action="store_true", help="run eval only")
    parser.add_argument(
        "-ckpt", "--checkpoint", type=str, help="path to load checkpoint"
    )
    args = parser.parse_args(args = [])
    return args


if __name__ == "__main__":
    args = parse_args()
    if args.eval:
        evaluate(args)
    else:
        train(args)