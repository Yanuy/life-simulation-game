/**
 * items.js - 物品和商店模块
 * 负责管理游戏中的物品、物品效果和商店系统
 */

class Item {
    constructor(id, name, description, price, type, effects, requirements = {}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.type = type; // 类型：书籍、电子产品、食品、装备等
        this.effects = effects; // 使用效果
        this.requirements = requirements; // 购买或使用要求
    }
    
    // 检查角色是否满足使用要求
    canUse(character) {
        if (this.requirements.minAge && character.age < this.requirements.minAge) {
            return false;
        }
        if (this.requirements.minIntelligence && character.attributes.intelligence < this.requirements.minIntelligence) {
            return false;
        }
        if (this.requirements.lifeStage && character.lifeStage !== this.requirements.lifeStage) {
            return false;
        }
        return true;
    }
    
    // 使用物品，应用效果
    use(character) {
        if (!this.canUse(character)) {
            return {
                success: false,
                message: "你不满足使用该物品的条件"
            };
        }
        
        // 应用物品效果
        let effectsApplied = [];
        
        for (const effect of this.effects) {
            switch (effect.type) {
                case 'attribute':
                    if (character.attributes[effect.target]) {
                        character.attributes[effect.target] += effect.value;
                        character.attributes[effect.target] = Math.max(0, Math.min(100, character.attributes[effect.target]));
                        effectsApplied.push(`${effect.target} ${effect.value > 0 ? '+' : ''}${effect.value}`);
                    }
                    break;
                    
                case 'skill':
                    if (character.skills[effect.target] && !character.skills[effect.target].locked) {
                        character.gainSkillExperience(effect.target, effect.value);
                        effectsApplied.push(`${effect.target} 经验 +${effect.value}`);
                    }
                    break;
                    
                case 'money':
                    character.money += effect.value;
                    effectsApplied.push(`金钱 ${effect.value > 0 ? '+' : ''}${effect.value}`);
                    break;
                    
                case 'unlockSkill':
                    if (character.skills[effect.target] && character.skills[effect.target].locked) {
                        character.unlockSkill(effect.target);
                        effectsApplied.push(`解锁技能: ${effect.target}`);
                    }
                    break;
            }
        }
        
        character.updateUI();
        
        return {
            success: true,
            message: `使用了 ${this.name}`,
            effects: effectsApplied
        };
    }
}

class ItemManager {
    constructor() {
        this.items = {};
        this.shopItems = [];
        this.initializeItems();
    }
    
    // 初始化物品库
    initializeItems() {
        // 学习类物品
        this.registerItem(new Item(
            'textbook',
            '教科书',
            '基础教材，提高学习效率',
            50,
            '书籍',
            [
                { type: 'attribute', target: 'intelligence', value: 5 },
                { type: 'skill', target: 'academicBasics', value: 20 }
            ]
        ));
        
        this.registerItem(new Item(
            'computer',
            '电脑',
            '可以用来学习和娱乐',
            2000,
            '电子产品',
            [
                { type: 'attribute', target: 'intelligence', value: 10 },
                { type: 'attribute', target: 'happiness', value: 15 },
                { type: 'skill', target: 'academicBasics', value: 30 }
            ],
            { minAge: 10 }
        ));
        
        this.registerItem(new Item(
            'professional_books',
            '专业书籍',
            '深入学习专业知识',
            200,
            '书籍',
            [
                { type: 'attribute', target: 'intelligence', value: 8 },
                { type: 'skill', target: 'professionalSkills', value: 25 }
            ],
            { minAge: 18, lifeStage: '大学' }
        ));
        
        // 健康类物品
        this.registerItem(new Item(
            'sports_equipment',
            '运动器材',
            '提高体质和健康',
            500,
            '装备',
            [
                { type: 'attribute', target: 'fitness', value: 15 },
                { type: 'attribute', target: 'health', value: 10 },
                { type: 'skill', target: 'physicalTraining', value: 30 }
            ]
        ));
        
        this.registerItem(new Item(
            'healthy_food',
            '健康食品',
            '提供营养，恢复体力',
            100,
            '食品',
            [
                { type: 'attribute', target: 'health', value: 20 },
                { type: 'attribute', target: 'fitness', value: 5 }
            ]
        ));
        
        // 社交类物品
        this.registerItem(new Item(
            'fashionable_clothes',
            '时尚服装',
            '提高魅力值',
            300,
            '服装',
            [
                { type: 'attribute', target: 'charm', value: 15 },
                { type: 'skill', target: 'socialSkills', value: 10 }
            ]
        ));
        
        this.registerItem(new Item(
            'smartphone',
            '智能手机',
            '方便社交和获取信息',
            1000,
            '电子产品',
            [
                { type: 'attribute', target: 'charm', value: 5 },
                { type: 'attribute', target: 'happiness', value: 10 },
                { type: 'skill', target: 'socialSkills', value: 15 }
            ],
            { minAge: 12 }
        ));
        
        // 娱乐类物品
        this.registerItem(new Item(
            'video_game',
            '电子游戏',
            '提供娱乐，增加幸福感',
            200,
            '电子产品',
            [
                { type: 'attribute', target: 'happiness', value: 25 },
                { type: 'attribute', target: 'health', value: -5 }
            ],
            { minAge: 8 }
        ));
        
        // 特殊物品
        this.registerItem(new Item(
            'skill_book_social',
            '社交技巧指南',
            '解锁社交技能',
            500,
            '书籍',
            [
                { type: 'unlockSkill', target: 'socialSkills' }
            ],
            { minAge: 12 }
        ));
        
        this.registerItem(new Item(
            'skill_book_financial',
            '个人理财入门',
            '解锁理财技能',
            800,
            '书籍',
            [
                { type: 'unlockSkill', target: 'financialSkills' }
            ],
            { minAge: 18 }
        ));
    }
    
    // 注册物品到物品库
    registerItem(item) {
        this.items[item.id] = item;
    }
    
    // 获取物品
    getItem(itemId) {
        return this.items[itemId];
    }
    
    // 更新商店物品列表
    updateShop(character) {
        this.shopItems = [];
        
        // 根据角色年龄和生命阶段筛选可购买物品
        for (const itemId in this.items) {
            const item = this.items[itemId];
            let canBuy = true;
            
            if (item.requirements.minAge && character.age < item.requirements.minAge) {
                canBuy = false;
            }
            
            if (item.requirements.lifeStage && character.lifeStage !== item.requirements.lifeStage) {
                canBuy = false;
            }
            
            if (canBuy) {
                this.shopItems.push(item);
            }
        }
        
        return this.shopItems;
    }
    
    // 渲染物品栏
    renderInventory(character) {
        const container = document.getElementById('inventory-container');
        container.innerHTML = '';
        
        if (character.inventory.length === 0) {
            container.innerHTML = '<div class="empty-inventory">物品栏为空</div>';
            return;
        }
        
        for (const item of character.inventory) {
            const itemElement = document.createElement('div');
            itemElement.className = 'inventory-item';
            itemElement.dataset.itemId = item.id;
            
            itemElement.innerHTML = `
                <div class="item-name">${item.name}</div>
                <div class="item-description">${item.description}</div>
                <button class="item-use">使用</button>
            `;
            
            container.appendChild(itemElement);
            
            // 添加使用物品事件
            itemElement.querySelector('.item-use').addEventListener('click', () => {
                const result = character.useItem(item.id);
                if (result && result.success) {
                    Game.addEventLog(result.message);
                    if (result.effects) {
                        for (const effect of result.effects) {
                            Game.addEventLog(`效果: ${effect}`);
                        }
                    }
                    this.renderInventory(character);
                } else if (result) {
                    Game.addEventLog(result.message);
                }
            });
        }
    }
    
    // 渲染商店
    renderShop(character) {
        const container = document.getElementById('shop-container');
        container.innerHTML = '';
        
        const shopItems = this.updateShop(character);
        
        if (shopItems.length === 0) {
            container.innerHTML = '<div class="empty-shop">商店暂无可购买物品</div>';
            return;
        }
        
        for (const item of shopItems) {
            const itemElement = document.createElement('div');
            itemElement.className = 'shop-item';
            
            itemElement.innerHTML = `
                <div class="shop-item-info">
                    <div class="shop-item-name">${item.name}</div>
                    <div class="shop-item-description">${item.description}</div>
                </div>
                <div class="shop-item-price">¥${item.price}</div>
                <button class="shop-item-buy" ${character.money < item.price ? 'disabled' : ''}>购买</button>
            `;
            
            container.appendChild(itemElement);
            
            // 添加购买物品事件
            itemElement.querySelector('.shop-item-buy').addEventListener('click', () => {
                if (character.buyItem(item)) {
                    Game.addEventLog(`购买了 ${item.name}`);
                    document.getElementById('money').textContent = character.money;
                    this.renderShop(character);
                    this.renderInventory(character);
                } else {
                    Game.addEventLog('金钱不足，无法购买');
                }
            });
        }
    }
}

// 导出ItemManager类
if (typeof module !== 'undefined') {
    module.exports = { Item, ItemManager };
}
