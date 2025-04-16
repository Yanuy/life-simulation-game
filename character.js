// 角色类
class Character {
    constructor() {
        this.age = 0;
        this.lifeStage = "infant"; // infant, child, teen, university, graduate, phd, society
        
        this.attributes = {
            health: 100,    // 体力
            intelligence: 10, // 智力
            charm: 10,      // 魅力
            fitness: 10,    // 体质
            happiness: 50   // 幸福感
        };
        
        this.money = 0;
        this.inventory = [];
        this.skills = {};
        this.relationships = {};
        
        // 初始化基本技能
        this.skills["学术基础"] = { level: 0, progress: 0 };
        this.skills["体育锻炼"] = { level: 0, progress: 0 };
        this.skills["社交能力"] = { level: 0, progress: 0 };
        this.skills["专业技能"] = { level: 0, progress: 0, locked: true };
        this.skills["理财能力"] = { level: 0, progress: 0, locked: true };
    }
    
    applyTimeAllocation(timeAllocation) {
        // 根据时间分配更新属性
        
        // 学习时间影响智力
        this.attributes.intelligence += timeAllocation.study * 0.05;
        // 上限为100
        this.attributes.intelligence = Math.min(100, this.attributes.intelligence);
        
        // 娱乐时间影响幸福感
        this.attributes.happiness += timeAllocation.entertainment * 0.1;
        // 娱乐太少，幸福感下降
        if (timeAllocation.entertainment < 10) {
            this.attributes.happiness -= (10 - timeAllocation.entertainment) * 0.5;
        }
        
        // 健身时间影响体质
        this.attributes.fitness += timeAllocation.fitness * 0.08;
        this.attributes.fitness = Math.min(100, this.attributes.fitness);
        
        // 社交时间影响魅力
        this.attributes.charm += timeAllocation.social * 0.07;
        this.attributes.charm = Math.min(100, this.attributes.charm);
        
        // 工作时间影响金钱和幸福感
        if (this.age >= 16) { // 16岁以上可以打工
            let hourlyRate = 20; // 基础时薪
            
            // 专业技能提高时薪
            if (this.skills["专业技能"] && this.skills["专业技能"].level > 0) {
                hourlyRate += this.skills["专业技能"].level * 5;
            }
            
            // 大学及以上学历提高时薪
            if (["university", "graduate", "phd", "society"].includes(this.lifeStage)) {
                hourlyRate += 10;
            }
            
            // 社会阶段提高时薪
            if (this.lifeStage === "society") {
                hourlyRate += 20;
            }
            
            const annualIncome = hourlyRate * 8 * 5 * 4 * 12 * (timeAllocation.work / 100);
            this.money += annualIncome;
            
            // 工作太多，幸福感下降
            if (timeAllocation.work > 50) {
                this.attributes.happiness -= (timeAllocation.work - 50) * 0.2;
            }
        }
        
        // 体力管理
        // 每年基础体力消耗
        this.attributes.health -= 10;
        
        // 健身增加体力恢复
        this.attributes.health += timeAllocation.fitness * 0.5;
        
        // 年龄影响体力恢复
        if (this.age > 30) {
            this.attributes.health -= (this.age - 30) * 0.01;
        }
        
        // 体力上限
        this.attributes.health = Math.min(100, this.attributes.health);
        
        // 体力下限
        this.attributes.health = Math.max(1, this.attributes.health);
        
        // 幸福感上限和下限
        this.attributes.happiness = Math.min(100, this.attributes.happiness);
        this.attributes.happiness = Math.max(1, this.attributes.happiness);
        
        // 自然增长
        if (this.age < 18) {
            this.attributes.intelligence += 3; // 未成年智力自然增长
            this.attributes.fitness += 2;      // 未成年体质自然增长
        }
    }
    
    checkLifeStageChange() {
        if (this.age < 6) {
            this.lifeStage = "infant";
        } else if (this.age < 12) {
            this.lifeStage = "child";
        } else if (this.age < 18) {
            this.lifeStage = "teen";
        }
        // 其他阶段在nextYear方法中根据条件变更
    }
    
    getLifeStageText() {
        const stageMap = {
            "infant": "婴幼儿期",
            "child": "儿童期",
            "teen": "青少年期",
            "university": "大学期",
            "graduate": "研究生期",
            "phd": "博士期",
            "society": "社会期"
        };
        return stageMap[this.lifeStage] || this.lifeStage;
    }
    
    addItem(item) {
        this.inventory.push(item);
    }
    
    removeItem(itemId) {
        const index = this.inventory.findIndex(item => item.id === itemId);
        if (index !== -1) {
            this.inventory.splice(index, 1);
            return true;
        }
        return false;
    }
    
    hasItem(itemId) {
        return this.inventory.some(item => item.id === itemId);
    }
    
    useItem(itemId) {
        const item = this.inventory.find(item => item.id === itemId);
        if (item && typeof item.use === 'function') {
            item.use(this);
            
            // 如果是一次性物品，使用后移除
            if (item.consumable) {
                this.removeItem(itemId);
            }
            
            return true;
        }
        return false;
    }
    
    addSkillProgress(skillName, amount) {
        if (this.skills[skillName] && !this.skills[skillName].locked) {
            this.skills[skillName].progress += amount;
            
            // 检查是否升级
            if (this.skills[skillName].progress >= 100) {
                this.skills[skillName].level += 1;
                this.skills[skillName].progress = 0;
                return true; // 返回是否升级
            }
        }
        return false;
    }
}