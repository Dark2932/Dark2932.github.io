# API 核心功能

本文档介绍 Architectury API 的核心功能，适用于 Minecraft 1.21.1 版本。

## 注册系统

### 生活化比喻

想象你在开一家餐厅，需要向工商局"注册"你的菜品：

| 概念 | 比喻 |
|------|------|
| **注册** | 向工商局登记你的菜品，这样顾客才能点餐 |
| **DeferredRegister** | 先把菜品写在申请表上，等统一时间再提交 |
| **RegistrySupplier** | 注册成功后拿到的"营业执照"，证明你的菜品合法 |

### 为什么需要 Architectury 的注册系统？

不同平台的注册方式不同，就像不同城市的工商局流程不一样：

```
Fabric 平台：直接去柜台登记（简单直接）
Forge 平台：必须在特定时间窗口内登记（有时间限制）
NeoForge 平台：又是一种新的流程

Architectury：提供统一的"代办服务"，你只管填表，它帮你搞定所有平台
```

### 推荐方式：使用 DeferredRegister

```java
public class ModItems {
    // 第一步：创建"申请表"
    // 就像准备一叠空白的营业执照申请表
    public static final DeferredRegister<Item> ITEMS = 
        DeferredRegister.create(MOD_ID, Registries.ITEM);
    
    // 第二步：填写申请表内容
    // 就像在申请表上写"我要注册一个叫'example_item'的物品"
    public static final RegistrySupplier<Item> EXAMPLE_ITEM = 
        ITEMS.register("example_item", 
            () -> new Item(new Item.Properties()));
    
    // 第三步：提交申请表
    // 就像把所有申请表一次性交给工商局
    public static void register() {
        ITEMS.register();  // 这一行会把所有物品注册到游戏里
    }
}
```

**关键点**：
- `DeferredRegister` = 申请表收集箱
- `register("name", () -> new Item())` = 填写一张申请表
- `ITEMS.register()` = 提交所有申请表

### 完整的物品注册示例

```java
public class ModItems {
    public static final DeferredRegister<Item> ITEMS = 
        DeferredRegister.create(MOD_ID, Registries.ITEM);
    
    // 注册一个普通物品
    public static final RegistrySupplier<Item> RUBY = 
        ITEMS.register("ruby", 
            () -> new Item(new Item.Properties()
                .arch$tab(ModTabs.GEMS_TAB)));  // 放入创意模式标签页
    
    // 注册一把剑
    public static final RegistrySupplier<SwordItem> RUBY_SWORD = 
        ITEMS.register("ruby_sword", 
            () -> new SwordItem(
                Tiers.DIAMOND,      // 材质等级（和钻石一样）
                3,                   // 额外攻击力
                -2.4F,               // 攻击速度（负数表示比默认慢）
                new Item.Properties()
                    .arch$tab(ModTabs.GEMS_TAB)));
    
    public static void register() {
        ITEMS.register();
    }
}
```

### 方块注册

方块比较特殊，需要同时注册"方块"和"方块物品"：

```java
public class ModBlocks {
    // 方块注册表
    public static final DeferredRegister<Block> BLOCKS = 
        DeferredRegister.create(MOD_ID, Registries.BLOCK);
    
    // 方块物品注册表（方块在背包里的形式）
    public static final DeferredRegister<Item> ITEMS = 
        DeferredRegister.create(MOD_ID, Registries.ITEM);
    
    // 注册方块本身
    public static final RegistrySupplier<Block> RUBY_BLOCK = 
        BLOCKS.register("ruby_block", 
            () -> new Block(BlockBehaviour.Properties.of()
                .strength(3.0F, 3.0F)           // 硬度和爆炸抗性
                .requiresCorrectToolForDrops())); // 需要正确工具才能掉落
    
    // 注册方块物品（背包里的那个）
    public static final RegistrySupplier<Item> RUBY_BLOCK_ITEM = 
        ITEMS.register("ruby_block", 
            () -> new BlockItem(RUBY_BLOCK.get(),  // 关联到上面的方块
                new Item.Properties()
                    .arch$tab(ModTabs.GEMS_TAB)));
    
    public static void register() {
        BLOCKS.register();
        ITEMS.register();
    }
}
```

**为什么方块要注册两次？**
```
方块（Block）= 游戏世界里的那个大方块
方块物品（BlockItem）= 你背包里拿的那个小方块图标

它们是两个不同的东西，所以要注册两次！
```

### 实体注册

```java
public class ModEntities {
    public static final DeferredRegister<EntityType<?>> ENTITIES = 
        DeferredRegister.create(MOD_ID, Registries.ENTITY_TYPE);
    
    public static final RegistrySupplier<EntityType<RubyGolem>> RUBY_GOLEM = 
        ENTITIES.register("ruby_golem", 
            () -> EntityType.Builder.of(RubyGolem::new, MobCategory.CREATURE)
                .sized(0.9F, 1.4F)  // 碰撞箱大小（宽，高）
                .build("ruby_golem"));
    
    public static void register() {
        ENTITIES.register();
    }
}
```

### 附魔注册

```java
public class ModEnchantments {
    public static final DeferredRegister<Enchantment> ENCHANTMENTS = 
        DeferredRegister.create(MOD_ID, Registries.ENCHANTMENT);
    
    public static final RegistrySupplier<Enchantment> RUBY_EDGE = 
        ENCHANTMENTS.register("ruby_edge", 
            () -> new Enchantment(Enchantment.definition(
                // 哪些物品可以有这个附魔
                TagKey.create(Registries.ITEM, 
                    new ResourceLocation(MOD_ID, "enchantable")),
                Optional.empty(),  // 不和哪些附魔冲突
                3,                 // 最高等级（III级）
                EquipmentSlotGroup.MAINHAND,  // 只在主手生效
                EnchantmentTarget.WEAPON)));  // 武器类型附魔
    
    public static void register() {
        ENCHANTMENTS.register();
    }
}
```

## 事件系统

### 生活化比喻

事件系统就像餐厅的"通知系统"：

```
事件（Event）= 发生了一件事，比如"顾客点了餐"
监听器（Listener）= 你设置的"通知规则"
注册监听器 = 告诉系统"当顾客点餐时通知我"
```

### 基本用法

```java
// 监听"实体受伤"事件
EntityEvent.LIVING_HURT.register((entity, source, amount) -> {
    // entity = 受伤的实体
    // source = 伤害来源
    // amount = 伤害值
    
    if (entity instanceof Player player) {
        player.sendMessage(Component.literal("你受伤了！"), player.getUUID());
    }
    
    return EventResult.pass();  // 允许伤害继续
});
```

### 常用事件示例

#### 阻止特定伤害

```java
// 让玩家免疫摔落伤害
EntityEvent.LIVING_HURT.register((entity, source, amount) -> {
    if (entity instanceof Player && source.is(DamageTypes.FALL)) {
        return EventResult.interruptFalse();  // 阻止这次伤害
    }
    return EventResult.pass();  // 其他伤害正常处理
});
```

#### 监听方块放置

```java
// 当玩家放置方块时
BlockEvent.PLACE.register((level, pos, state, placer) -> {
    if (placer instanceof Player player) {
        player.sendMessage(
            Component.literal("你放置了: " + state.getBlock().getName()), 
            player.getUUID());
    }
    return EventResult.pass();
});
```

#### 监听玩家登录

```java
// 玩家登录时发送欢迎消息
PlayerEvent.PLAYER_JOIN.register((player) -> {
    player.sendMessage(
        Component.literal("欢迎来到服务器！"), 
        player.getUUID());
});
```

### EventResult 返回值解释

| 返回值 | 效果 | 使用场景 |
|--------|------|----------|
| `EventResult.pass()` | 不做任何干预 | 你只是想看看发生了什么 |
| `EventResult.interruptTrue()` | 成功，阻止后续处理 | 你已经完美处理了这个事件 |
| `EventResult.interruptFalse()` | 阻止事件发生 | 你想阻止这个事件 |
| `EventResult.interruptDefault()` | 阻止，返回默认值 | 你想阻止并使用默认行为 |

## 网络系统

### 生活化比喻

网络系统就像餐厅的"外卖系统"：

```
发送数据包 = 发送一份外卖订单
接收处理器 = 餐厅收到订单后的处理流程
编码（encode）= 把订单内容写在纸上
解码（decode）= 餐厅读取订单内容
```

### 为什么需要网络？

Minecraft 有客户端（玩家的电脑）和服务器（游戏服务器），它们需要"对话"：

```
玩家按下按钮 → 客户端发送"按钮被按下" → 服务器处理 → 服务器发送结果 → 客户端显示
```

### 简单方式：NetworkManager

```java
// 第一步：定义"订单类型"的ID
public static final ResourceLocation MY_PACKET_ID = 
    new ResourceLocation("mymod", "my_packet");

// 第二步：告诉服务器如何处理这种订单
NetworkManager.registerReceiver(
    NetworkManager.Side.C2S,  // C2S = 客户端发给服务器
    MY_PACKET_ID, 
    (buf, context) -> {
        // 读取订单内容
        BlockPos pos = buf.readBlockPos();
        
        // 处理订单（在服务器上执行）
        ServerPlayer player = (ServerPlayer) context.getPlayer();
        player.serverLevel().setBlockAndUpdate(pos, Blocks.DIAMOND_BLOCK.defaultBlockState());
    }
);

// 第三步：客户端发送订单
public static void sendBlockPosToServer(BlockPos pos) {
    FriendlyPacketBuf buf = new FriendlyPacketBuf(Unpooled.buffer());
    buf.writeBlockPos(pos);  // 写入方块坐标
    NetworkManager.sendToServer(MY_PACKET_ID, buf);
}
```

### 结构化方式：NetworkChannel（推荐）

这种方式更整洁，像定义一个"外卖菜单"：

```java
// 第一步：创建"外卖频道"
public static final NetworkChannel CHANNEL = 
    NetworkChannel.create(new ResourceLocation("mymod", "main_channel"));

// 第二步：定义一种"外卖订单"的格式
public class TeleportMessage {
    private final BlockPos targetPos;
    
    // 从"纸条"上读取订单（解码）
    public TeleportMessage(FriendlyPacketBuf buf) {
        this.targetPos = buf.readBlockPos();
    }
    
    // 创建新订单
    public TeleportMessage(BlockPos pos) {
        this.targetPos = pos;
    }
    
    // 把订单写在"纸条"上（编码）
    public void encode(FriendlyPacketBuf buf) {
        buf.writeBlockPos(targetPos);
    }
    
    // 收到订单后怎么处理
    public void apply(Supplier<PacketContext> context) {
        PacketContext ctx = context.get();
        ctx.queue(() -> {  // 必须在主线程执行！
            if (ctx.getPlayer() instanceof ServerPlayer player) {
                player.teleportTo(targetPos.getX(), targetPos.getY(), targetPos.getZ());
            }
        });
    }
}

// 第三步：注册这种订单类型
CHANNEL.register(
    TeleportMessage.class,
    TeleportMessage::encode,    // 怎么写
    TeleportMessage::new,       // 怎么读
    TeleportMessage::apply      // 怎么处理
);

// 第四步：发送订单
CHANNEL.sendToServer(new TeleportMessage(new BlockPos(100, 64, 100)));
CHANNEL.sendToPlayer(player, new TeleportMessage(new BlockPos(100, 64, 100)));
```

## 创意标签

### 生活化比喻

创意标签就像超市的"货架分区"：

```
创意标签（Creative Tab）= 超市的分区（食品区、饮料区、日用品区）
物品放入标签 = 把商品摆到对应的货架上
```

### 创建创意标签

```java
public class ModTabs {
    public static final DeferredRegister<CreativeModeTab> TABS = 
        DeferredRegister.create(MOD_ID, Registries.CREATIVE_MODE_TAB);
    
    // 创建一个新标签页
    public static final RegistrySupplier<CreativeModeTab> GEMS_TAB = 
        TABS.register("gems", 
            () -> CreativeTabRegistry.create(
                Component.translatable("itemGroup.mymod.gems"),  // 标签页名称
                () -> new ItemStack(ModItems.RUBY.get())         // 标签页图标
            )
        );
    
    public static void register() {
        TABS.register();
    }
}
```

### 将物品放入标签

```java
// 方法1：在创建物品时指定标签
public static final RegistrySupplier<Item> RUBY = 
    ITEMS.register("ruby", 
        () -> new Item(new Item.Properties()
            .arch$tab(ModTabs.GEMS_TAB)));  // 放入"宝石"标签页

// 方法2：使用物品属性（推荐）
Item.Properties props = new Item.Properties().arch$tab(ModTabs.GEMS_TAB);
```

## 平台检测

### 什么时候需要平台检测？

大多数情况下你不需要检测平台，Architectury 帮你处理了。但有时你确实需要：

```java
// 获取当前平台名称
String platform = ArchitecturyTarget.getCurrentTarget();
// 返回 "fabric"、"forge" 或 "neoforge"

// 示例：根据平台显示不同消息
if (ArchitecturyTarget.getCurrentTarget().equals("fabric")) {
    LOGGER.info("运行在 Fabric 平台上");
} else if (ArchitecturyTarget.getCurrentTarget().equals("forge")) {
    LOGGER.info("运行在 Forge 平台上");
}
```

### 更好的方式：使用 @ExpectPlatform

```java
// 在公共代码中声明
@ExpectPlatform
public static File getConfigDir() {
    throw new AssertionError();  // 这行永远不会执行
}

// 在 Fabric 模块中实现
public class PlatformHelperImpl {
    public static File getConfigDir() {
        return FabricLoader.getInstance().getConfigDir().toFile();
    }
}

// 在 Forge 模块中实现
public class PlatformHelperImpl {
    public static File getConfigDir() {
        return FMLPaths.CONFIGDIR.get().toFile();
    }
}
```

## 总结

| 功能 | 用途 | 常用程度 |
|------|------|----------|
| **DeferredRegister** | 注册物品、方块等 | ⭐⭐⭐⭐⭐ |
| **事件系统** | 监听游戏事件 | ⭐⭐⭐⭐⭐ |
| **网络系统** | 客户端和服务器通信 | ⭐⭐⭐⭐ |
| **创意标签** | 创建物品分类标签页 | ⭐⭐⭐ |
| **@ExpectPlatform** | 调用平台特定功能 | ⭐⭐⭐ |
