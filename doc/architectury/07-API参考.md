# API 参考

本文档提供 Architectury API 的速查手册，适用于 Minecraft 1.21.1 版本。

> 💡 **使用建议**：不需要记住所有内容！先浏览一遍知道"有什么"，需要时再回来查。

## 核心包速查

### dev.architectury.core - 跨平台物品/方块基类

这些类是 Minecraft 原版类的"跨平台版本"，用法几乎一样：

| 类 | 用途 | 什么时候用 |
|---|------|------------|
| `ArchitecturyItem` | 跨平台物品基类 | 自定义物品行为时继承 |
| `ArchitecturyBlock` | 跨平台方块基类 | 自定义方块行为时继承 |
| `ArchitecturyBlockItem` | 跨平台方块物品 | 自定义方块物品行为时继承 |
| `ArchitecturySpawnEggItem` | 跨平台生成蛋 | 需要实体生成蛋时使用 |
| `ArchitecturySwordItem` | 跨平台剑 | 自定义剑时继承 |
| `ArchitecturyPickaxeItem` | 跨平台镐 | 自定义镐时继承 |
| `ArchitecturyAxeItem` | 跨平台斧 | 自定义斧时继承 |
| `ArchitecturyArmorItem` | 跨平台盔甲 | 自定义盔甲时继承 |
| `ArchitecturyBucketItem` | 跨平台桶 | 自定义流体桶时使用 |

### dev.architectury.registry - 注册系统

| 类 | 用途 | 通俗理解 |
|---|------|----------|
| `DeferredRegister<T>` | 延迟注册器 | "申请表收集箱" |
| `RegistrySupplier<T>` | 注册供应器 | "注册成功后的收据" |
| `Registrar<T>` | 注册器接口 | "工商局柜台" |
| `RegistrarManager` | 注册管理器 | "工商局总管" |
| `Registries` | 注册表常量 | "各种注册表的名称列表" |

### dev.architectury.event - 事件系统

| 类 | 用途 | 通俗理解 |
|---|------|----------|
| `Event<T>` | 事件接口 | "订阅频道" |
| `EventResult` | 事件结果 | "决定是否让事件继续" |
| `EventPriority` | 事件优先级 | "排队的优先级" |

### dev.architectury.network - 网络系统

| 类 | 用途 | 通俗理解 |
|---|------|----------|
| `NetworkManager` | 网络管理器 | "快递公司的底层API" |
| `NetworkChannel` | 网络频道 | "快递公司的订单系统" |
| `PacketContext` | 数据包上下文 | "这次快递的详细信息" |
| `FriendlyPacketBuf` | 数据包缓冲区 | "装快递内容的箱子" |

### dev.architectury.injectables.annotations - 注解

| 类 | 用途 | 通俗理解 |
|---|------|----------|
| `@ExpectPlatform` | 平台特定实现 | "这里有个空壳，平台会自己填" |
| `@Env` | 环境注解 | "只在客户端/服务器运行" |

### dev.architectury.hooks - 钩子

| 类 | 用途 | 通俗理解 |
|---|------|----------|
| `ItemPropertiesExtensions` | 物品属性扩展 | "给物品添加更多属性" |
| `BiomeModifications` | 生物群系修改 | "修改生物群系的特征" |
| `EntityHooks` | 实体钩子 | "在实体行为上加钩子" |
| `LevelHooks` | 世界钩子 | "在世界上加钩子" |

### dev.architectury.platform - 平台

| 类 | 用途 | 通俗理解 |
|---|------|----------|
| `ArchitecturyTarget` | 平台目标检测 | "我运行在哪个平台上？" |
| `Platform` | 平台信息 | "获取平台详细信息" |

## 注册表常量

Registries 类里定义了所有可以用的注册表名称：

```java
Registries.BLOCK              // 方块注册表
Registries.ITEM               // 物品注册表
Registries.ENTITY_TYPE        // 实体类型注册表
Registries.BLOCK_ENTITY_TYPE  // 方块实体类型注册表
Registries.ENCHANTMENT        // 附魔注册表
Registries.MOB_EFFECT         // 药水效果注册表
Registries.FLUID              // 流体注册表
Registries.CREATIVE_MODE_TAB  // 创意标签注册表
Registries.RECIPE_TYPE        // 配方类型注册表
Registries.RECIPE_SERIALIZER  // 配方序列化器注册表
Registries.SOUND_EVENT        // 声音事件注册表
Registries.PARTICLE_TYPE      // 粒子类型注册表
Registries.PAINTING_TYPE      // 画类型注册表
Registries.MENU_TYPE          // 菜单类型注册表
Registries.FEATURE            // 特征注册表
Registries.PLACEMENT_MODIFIER // 放置修饰符注册表
```

**使用方式**：`DeferredRegister.create(MOD_ID, Registries.ITEM)` 中的 `Registries.ITEM` 就是从这里选的。

## 常用代码速查

### 物品注册

```java
public static final DeferredRegister<Item> ITEMS = 
    DeferredRegister.create(MOD_ID, Registries.ITEM);

public static final RegistrySupplier<Item> EXAMPLE = 
    ITEMS.register("example", 
        () -> new Item(new Item.Properties().arch$tab(TAB)));

public static void register() {
    ITEMS.register();
}
```

### 方块注册

```java
public static final DeferredRegister<Block> BLOCKS = 
    DeferredRegister.create(MOD_ID, Registries.BLOCK);

// 方块本身
public static final RegistrySupplier<Block> EXAMPLE = 
    BLOCKS.register("example", 
        () -> new Block(BlockBehaviour.Properties.of()
            .strength(3.0F, 3.0F)));  // 硬度，爆炸抗性

// 方块在背包里的形式
public static final RegistrySupplier<Item> EXAMPLE_ITEM = 
    ITEMS.register("example", 
        () -> new BlockItem(EXAMPLE.get(), 
            new Item.Properties().arch$tab(TAB)));
```

### 实体注册

```java
public static final DeferredRegister<EntityType<?>> ENTITIES = 
    DeferredRegister.create(MOD_ID, Registries.ENTITY_TYPE);

public static final RegistrySupplier<EntityType<ExampleEntity>> EXAMPLE = 
    ENTITIES.register("example", 
        () -> EntityType.Builder.of(ExampleEntity::new, MobCategory.CREATURE)
            .sized(0.9F, 1.4F)   // 宽度，高度
            .build("example"));
```

### 创意标签

```java
public static final DeferredRegister<CreativeModeTab> TABS = 
    DeferredRegister.create(MOD_ID, Registries.CREATIVE_MODE_TAB);

public static final RegistrySupplier<CreativeModeTab> EXAMPLE_TAB = 
    TABS.register("example", 
        () -> CreativeTabRegistry.create(
            Component.translatable("itemGroup.example"),  // 标签名
            () -> new ItemStack(EXAMPLE_ITEM.get())));     // 图标
```

### 事件监听

```java
// 实体受伤
EntityEvent.LIVING_HURT.register((entity, source, amount) -> {
    return EventResult.pass();
});

// 方块放置
BlockEvent.PLACE.register((level, pos, state, placer) -> {
    return EventResult.pass();
});

// 玩家登录
PlayerEvent.PLAYER_JOIN.register((player) -> {
    player.sendMessage(Component.literal("欢迎！"), player.getUUID());
});
```

### 网络消息

```java
// 创建频道
public static final NetworkChannel CHANNEL = 
    NetworkChannel.create(new ResourceLocation(MOD_ID, "main"));

// 注册消息类型
CHANNEL.register(ExampleMessage.class, 
    ExampleMessage::encode, 
    ExampleMessage::new, 
    ExampleMessage::apply);

// 发送消息
CHANNEL.sendToServer(new ExampleMessage(pos));
CHANNEL.sendToPlayer(player, new ExampleMessage(pos));
```

### @ExpectPlatform

```java
// 声明（common 中）
@ExpectPlatform
public static File getConfigDir() {
    throw new AssertionError();
}

// 实现（fabric 中）
public class ExampleClassImpl {
    public static File getConfigDir() {
        return FabricLoader.getInstance().getConfigDir().toFile();
    }
}

// 实现（forge 中）
public class ExampleClassImpl {
    public static File getConfigDir() {
        return FMLPaths.CONFIGDIR.get().toFile();
    }
}
```

## Gradle 依赖配置速查

### 依赖类型通俗解释

| 配置 | 通俗解释 | 使用场景 |
|------|----------|----------|
| `implementation` | "编译和运行都需要" | 最常用的依赖方式 |
| `api` | "编译和运行都需要，而且让别人也能用" | 你的模组提供的 API |
| `compileOnly` | "只在写代码时需要，运行时不需要" | 平台加载器（运行时由平台提供） |
| `runtimeOnly` | "只在运行时需要" | 运行时才加载的库 |
| `modImplementation` | "这是一个模组，需要特殊处理" | 依赖其他模组 |
| `modApi` | "这是一个模组API，让别人也能用" | 依赖其他模组的 API |
| `include` | "把这个库塞进我的模组jar里" | 用户不需要单独安装这个库 |
| `forgeRuntimeLibrary` | "Forge 特殊：把这个库加到运行时路径" | Forge 平台的非模组库 |

### 实际例子

```groovy
dependencies {
    // Minecraft 本体
    minecraft "com.mojang:minecraft:1.21.1"
    
    // 映射文件
    mappings loom.officialMojangMappings()
    
    // 模组依赖
    modImplementation "net.fabricmc.fabric-api:fabric-api:0.16.0"
    modImplementation "dev.architectury:architectury:14.0.3"
    
    // 普通库
    implementation 'com.google.code.gson:gson:2.10.1'
    
    // 打包进模组
    include 'com.example:some-lib:1.0.0'
    
    // 仅编译时
    compileOnly "net.fabricmc:fabric-loader:0.16.9"
}
```

### 平台配置

```groovy
// common/build.gradle
architectury {
    common(rootProject.enabled_platforms.split(","))
}

// fabric/build.gradle
architectury {
    platformSetupLoomIde()
    fabric()
}

// forge/build.gradle
architectury {
    platformSetupLoomIde()
    forge()
}

// neoforge/build.gradle
architectury {
    platformSetupLoomIde()
    neoforge()
}
```

### Loom 配置

```groovy
loom {
    silentMojangMappingsLicense()  // 不再弹出映射许可确认
    accessWidenerPath = file("src/main/resources/yourmod.accesswidener")
    debugLog = true               // 启用调试日志
    mixins {
        defaultRefmapName = "yourmod.refmap.json"
    }
}
```

## 资源链接

- [官方文档](https://docs.architectury.dev/)
- [GitHub](https://github.com/architectury/architectury-api)
- [Discord](https://discord.architectury.dev/)（英文）
- [示例模组](https://github.com/architectury/architectury-examplemod)
