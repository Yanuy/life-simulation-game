/**
 * character.js - 角色模块
 * 负责管理玩家角色的属性、状态和生命阶段
 */

class Character {
    constructor() {
        // 基本属性
        this.age = 6; // 从6岁开始，小学一年级
        this.lifeStage = "义务教育"; // 生命阶段：义务教育、大学、硕博、社会
        this.money = 0;
        
        // 个人属性
        this.attributes = {
            health: 100, // 体力
            intelligence: 10, // 智力
            charm: 10, // 魅力
            fitness: 10, // 体质
            happiness: 50, // 幸福感
        };
        
        // 教育状态
        this.education = {
            currentSchool: "小学",
            grade: 1, // 年级
            gpa: 0, // 平均成绩
            hasCompletedCompulsoryEducation: false,
            hasCompletedHighSchool: false,
            hasCompletedCollege: false,
            hasMasterDegree: false,
            hasPhDDegree: false,
        };
        
        // 职业状态
        this.career = {
            hasJob: false,
            jobTitle: "",
            company: "",
            salary: 0,
            workExperience: 0,
        };
        
        // 时间分配
        this.timeAllocation = {
            study: 20,
            entertainment: 20,
            fitness: 10,
            social: 10,
            work: 0,
            remaining: 40
        };
        
        // 技能等级和经验
        this.skills = {
            academicBasics: { level: 0, experience: 0 },
            physicalTraining: { level: 0, experience: 0 },
            socialSkills: { level: 0, experience: 0, locked: true },
            professionalSkills: { level: 0, experience: 0, locked: true },
            financialSkills: { level: 0, experience: 0, locked: true }
        };
        
        // 关系网络
        this.relationships = {};
        
        // 物品栏
        this.inventory = [];
    }
    
    // 更新角色属性显示
    updateUI() {
        // 更新基本信息
        document.getElementById('age').textContent = this.age;
        document.getElementById('life-stage').textContent = this.lifeStage;
        document.getElementById('money').textContent = this.money;
        
        // 更新属性值和进度条
        for (const [key, value] of Object.entries(this.attributes)) {
            const elementId = key.toLowerCase();
            document.getElementById(`${elementId}-value`).textContent = value;
            document.getElementById(`${elementId}-bar`).style.width = `${value}%`;
        }
        
        // 更新技能等级和进度
        for (const [key, skill] of Object.entries(this.skills)) {
            const elementId = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            const levelElement = document.getElementById(`${elementId}-level`);
            const progressElement = document.getElementById(`${elementId}-progress`);
            
            if (levelElement && progressElement) {
                levelElement.textContent = skill.level;
                progressElement.style.width = `${(skill.experience % 100)}%`;
            }
        }
    }
    
    // 增加年龄并处理生命阶段变化
    ageUp() {
        this.age++;
        this.updateLifeStage();
        this.updateEducationStatus();
        this.applyTimeAllocationEffects();
        this.updateUI();
        
        return {
            newAge: this.age,
            newStage: this.lifeStage
        };
    }
    
    // 更新生命阶段
    updateLifeStage() {
        if (this.age < 18) {
            this.lifeStage = "义务教育";
        } else if (this.age < 22 && this.education.hasCompletedHighSchool) {
            this.lifeStage = "大学";
        } else if ((this.age < 25 && this.education.hasCompletedCollege) || 
                  (this.age < 28 && this.education.hasMasterDegree)) {
            this.lifeStage = "硕博";
        } else {
            this.lifeStage = "社会";
        }
    }
    
    // 更新教育状态
    updateEducationStatus() {
        if (this.lifeStage === "义务教育") {
            if (this.age < 12) {
                this.education.currentSchool = "小学";
                this.education.grade = this.age - 5;
            } else if (this.age < 15) {
                this.education.currentSchool = "初中";
                this.education.grade = this.age - 11;
            } else if (this.age < 18) {
                this.education.currentSchool = "高中";
                this.education.grade = this.age - 14;
            }
            
            if (this.age === 17) {
                this.education.hasCompletedCompulsoryEducation = true;
            }
        }
    }
    
    // 应用时间分配效果
    applyTimeAllocationEffects() {
        // 学习时间影响智力和学术技能
        this.attributes.intelligence += this.timeAllocation.study * 0.05;
        this.gainSkillExperience('academicBasics', this.timeAllocation.study * 2);
        
        // 娱乐时间影响幸福感
        this.attributes.happiness += this.timeAllocation.entertainment * 0.1;
        
        // 健身时间影响体质和体育技能
        this.attributes.fitness += this.timeAllocation.fitness * 0.1;
        this.gainSkillExperience('physicalTraining', this.timeAllocation.fitness * 2);
        
        // 社交时间影响魅力和社交技能
        this.attributes.charm += this.timeAllocation.social * 0.1;
        if (!this.skills.socialSkills.locked) {
            this.gainSkillExperience('socialSkills', this.timeAllocation.social * 2);
        }
        
        // 工作时间影响金钱和专业技能
        if (this.career.hasJob) {
            this.money += this.career.salary * (this.timeAllocation.work / 100);
            if (!this.skills.professionalSkills.locked) {
                this.gainSkillExperience('professionalSkills', this.timeAllocation.work * 2);
            }
        }
        
        // 体力消耗
        this.attributes.health -= 20;
        this.attributes.health += this.attributes.fitness * 0.2;
        
        // 属性值限制在0-100之间
        for (const key in this.attributes) {
            this.attributes[key] = Math.max(0, Math.min(100, this.attributes[key]));
        }
    }
    
    // 增加技能经验并处理升级
    gainSkillExperience(skillName, amount) {
        if (this.skills[skillName] && !this.skills[skillName].locked) {
            this.skills[skillName].experience += amount;
            
            // 每100点经验升一级
            if (this.skills[skillName].experience >= 100) {
                this.skills[skillName].level += Math.floor(this.skills[skillName].experience / 100);
                this.skills[skillName].experience %= 100;
            }
        }
    }
    
    // 解锁技能
    unlockSkill(skillName) {
        if (this.skills[skillName]) {
            this.skills[skillName].locked = false;
            return true;
        }
        return false;
    }
    
    // 设置时间分配
    setTimeAllocation(allocation) {
        // 检查总和是否为100
        let total = 0;
        for (const key in allocation) {
            total += allocation[key];
        }
        
        if (total > 100) {
            return false;
        }
        
        // 更新时间分配
        for (const key in allocation) {
            this.timeAllocation[key] = allocation[key];
        }
        
        // 计算剩余时间
        this.timeAllocation.remaining = 100 - total;
        
        return true;
    }
    
    // 添加物品到物品栏
    addItem(item) {
        this.inventory.push(item);
    }
    
    // 从物品栏移除物品
    removeItem(itemId) {
        const index = this.inventory.findIndex(item => item.id === itemId);
        if (index !== -1) {
            const item = this.inventory[index];
            this.inventory.splice(index, 1);
            return item;
        }
        return null;
    }
    
    // 使用物品
    useItem(itemId) {
        const item = this.removeItem(itemId);
        if (item && typeof item.use === 'function') {
            return item.use(this);
        }
        return false;
    }
    
    // 购买物品
    buyItem(item) {
        if (this.money >= item.price) {
            this.money -= item.price;
            this.addItem(item);
            return true;
        }
        return false;
    }
    
    // 增加关系
    addRelationship(npcId, npc, initialValue = 0) {
        this.relationships[npcId] = {
            npc: npc,
            value: initialValue
        };
    }
    
    // 更改关系值
    changeRelationship(npcId, amount) {
        if (this.relationships[npcId]) {
            this.relationships[npcId].value += amount;
            this.relationships[npcId].value = Math.max(0, Math.min(100, this.relationships[npcId].value));
            return true;
        }
        return false;
    }
}

// 导出Character类
if (typeof module !== 'undefined') {
    module.exports = Character;
}
