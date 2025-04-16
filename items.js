// 物品管理类
class ItemManager {
    constructor() {
        this.items = {
            // 书籍
            "textbook": {
                id: "textbook",
                name: "教科书",
                description: "提高学习效率，增加智力",
                price: 100,
                minAge: 6,
                lifeStages: ["child", "teen", "university", "graduate", "phd"],
                use: (character) => {
                    character.attributes.intelligence += 2;
                    game.addEventLog("你学习了教科书，智力+2。");
                },
                consumable: true
            },
            "novel": {
                id: "novel",
                name: "小说",
                description: "提高幸福感和智力",
                price: 50,
                minAge: 10,
                lifeStages: ["child", "teen", "university", "graduate", "phd", "society"],
                use: (character) => {
                    character.attributes.intelligence += 1;
                    character.attributes.happiness += 5;
                    game.addEventLog("你阅读了一本小说，幸福感+5，智力+1。");
                },
                consumable: true
            },
            "study_guide": {
                id: "study_guide",
                name: "学习指南",
                description: "大幅提高学习效率，为考试做准备",
                price: 200,
                minAge: 12,
                lifeStages: ["teen", "university", "graduate", "phd"],
                use: (character) => {
                    character.attributes.intelligence += 5;
                    character.addSkillProgress("学术基础", 20);
                    game.addEventLog("你使用了学习指南，智力+5，学术基础技能进度+20。");
                },
                consumable: true
            },
            
            // 电子设备
            "smartphone": {
                id: "smartphone",
                name: "智能手机",
                description: "提高社交能力和娱乐效果",
                price: 2000,
                minAge: 12,
                lifeStages: ["teen", "university", "graduate", "phd", "society"],
                use: (character) => {
                    character.attributes.happiness += 3;
                    character.addSkillProgress("社交能力", 5);
                    game.addEventLog("你玩了会手机，幸福感+3，社交能力进度+5。");
                },
                consumable: false
            },
            "laptop": {
                id: "laptop",
                name: "笔记本电脑",
                description: "提高学习和工作效率",
                price: 5000,
                minAge: 15,
                lifeStages: ["teen", "university", "graduate", "phd", "society"],
                use: (character) => {
                    character.attributes.intelligence += 2;
                    if (!character.skills["专业技能"].locked) {
                        character.addSkillProgress("专业技能", 10);
                    }
                    game.addEventLog("你使用了电脑学习，智力+2，专业技能进度+10。");
                },
                consumable: false
            },
            
            // 运动装备
            "sports_equipment": {
                id: "sports_equipment",
                name: "运动器材",
                description: "提高健身效果",
                price: 1000,
                minAge: 8,
                lifeStages: ["child", "teen", "university", "graduate", "phd", "society"],
                use: (character) => {
                    character.attributes.fitness += 3;
                    character.attributes.health += 5;
                    character.addSkillProgress("体育锻炼", 15);
                    game.addEventLog("你使用了运动器材，体质+3，体力+5，体育锻炼技能进度+15。");
                },
                consumable: false
            },
            
            // 社交物品
            "nice_clothes": {
                id: "nice_clothes",
                name: "时尚服装",
                description: "提高魅力",
                price: 500,
                minAge: 12,
                lifeStages: ["teen", "university", "graduate", "phd", "society"],
                use: (character) => {
                    character.attributes.charm += 5;
                    game.addEventLog("你穿上了时尚服装，魅力+5。");
                },
                consumable: false
            },
            
            // 饮食物品
            "healthy_food": {
                id: "healthy_food",
                name: "健康食品",
                description: "恢复体力",
                price: 50,
                minAge: 0,
                lifeStages: ["infant", "child", "teen", "university", "graduate", "phd", "society"],
                use: (character) => {
                    character.attributes.health += 10;
                    game.addEventLog("你吃了健康食品，体力+10。");
                },
                consumable: true
            },
            
            // 投资物品
            "stocks": {
                id: "stocks",
                name: "股票",
                description: "进行投资，有风险也有回报",
                price: 1000,
                minAge: 18,
                lifeStages: ["university", "graduate", "phd", "society"],
                use: (character) => {
                    const financialSkill = character.skills["理财能力"].level;
                    const baseReturn = Math.random() * 0.2 - 0.05; // -5% 到 15% 的基础回报率
                    const skillBonus = financialSkill * 0.01; // 每级理财能力增加1%回报率
                    const returnRate = baseReturn + skillBonus;
                    
                    const profit = 1000 * returnRate;
                    character.money += profit;
                    
                    character.addSkillProgress("理财能力", 10);
                    
                    if (profit > 0) {
                        game.addEventLog(`你的投资获得了收益，获得¥${profit.toFixed(2)}。`);
                    } else {
                        game.addEventLog(`你的投资亏损了，损失¥${Math.abs(profit).toFixed(2)}。`);
                    }
                },
                consumable: true
            },
            
            // 高级物品
            "certification": {
                id: "certification",
                name: "专业证书",
                description: "获得专业认证，提高就业能力",
                price: 3000,
                minAge: 18,
                lifeStages: ["university", "graduate", "phd", "society"],
                use: (character) => {
                    character.addSkillProgress("专业技能", 50);
                    game.addEventLog("你获得了专业证书，专业技能进度+50。");
                },
                consumable: true
            }
        };
    }
    
    getItem(itemId) {
        return this.items[itemId];
    }

    getAvailableItems(age, lifeStage) {
        const availableItems = {};

        for (const itemId in this.items) {
            // Check if the property belongs to `this.items` itself, not its prototype chain
            if (this.items.hasOwnProperty(itemId)) {
                const item = this.items[itemId];
                if (age >= item.minAge && (item.lifeStages.includes(lifeStage) || item.lifeStages.includes("all"))) {
                    availableItems[itemId] = item;
                }
            }
        }

        return availableItems;
    }

    
    buyItem(itemId, character) {
        const item = this.items[itemId];
        
        if (!item) return false;
        
        if (character.money >= item.price) {
            character.money -= item.price;
            character.addItem({...item}); // 复制一个物品添加到库存
            game.addEventLog(`你购买了${item.name}，花费¥${item.price}。`);
            return true;
        } else {
            game.addEventLog("你没有足够的钱来购买这个物品。");
            return false;
        }
    }
    
    updateInventoryUI(inventory) {
        const container = document.getElementById("inventory-container");
        container.innerHTML = "";
        
        if (inventory.length === 0) {
            container.innerHTML = "<p>物品栏是空的。访问商店购买物品。</p>";
            return;
        }
        
        for (const item of inventory) {
            const itemElement = document.createElement("div");
            itemElement.className = "inventory-item";
            itemElement.innerHTML = `
                <div>${item.name}</div>
                <div class="skill-description">${item.description}</div>
            `;
            
            itemElement.addEventListener("click", () => {
                game.character.useItem(item.id);
                game.updateUI();
            });
            
            container.appendChild(itemElement);
        }
    }
    
    updateShopUI(lifeStage, money) {
        const container = document.getElementById("shop-container");
        container.innerHTML = "";
        
        const availableItems = this.getAvailableItems(game.character.age, lifeStage);
        
        if (Object.keys(availableItems).length === 0) {
            container.innerHTML = "<p>当前阶段没有可用物品。</p>";
            return;
        }
        
        for (const itemId in availableItems) {
            const item = availableItems[itemId];
            
            const itemElement = document.createElement("div");
            itemElement.className = "shop-item";
            itemElement.innerHTML = `
                <div>
                    <div class="shop-item-name">${item.name}</div>
                    <div class="skill-description">${item.description}</div>
                </div>
                <div>
                    <div class="shop-item-price">¥${item.price}</div>
                    <button class="shop-item-buy" data-item-id="${itemId}" ${money < item.price ? 'disabled' : ''}>购买</button>
                </div>
            `;
            
            container.appendChild(itemElement);
        }
        
        // 添加购买按钮事件监听
        document.querySelectorAll(".shop-item-buy").forEach(button => {
            button.addEventListener("click", (e) => {
                const itemId = e.target.getAttribute("data-item-id");
                this.buyItem(itemId, game.character);
                game.updateUI();
            });
        });
    }
}