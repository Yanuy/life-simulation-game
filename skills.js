// 技能管理类
class SkillManager {
    constructor() {
        this.skillDefinations = {
            "学术基础": {
                id: "academic-basics",
                name: "学术基础",
                description: "提高学习效率和考试成绩",
                maxLevel: 10,
                effects: {
                    intelligenceBonus: 0.2 // 每级智力提升倍率
                }
            },
            "体育锻炼": {
                id: "physical-training",
                name: "体育锻炼",
                description: "提高体质和健康",
                maxLevel: 10,
                effects: {
                    fitnessBonus: 0.2, // 每级体质提升倍率
                    healthBonus: 0.1  // 每级体力恢复提升倍率
                }
            },
            "社交能力": {
                id: "social-skills",
                name: "社交能力",
                description: "提高魅力和人际关系",
                maxLevel: 10,
                effects: {
                    charmBonus: 0.2, // 每级魅力提升倍率
                    relationshipBonus: 0.1 // 每级关系提升倍率
                }
            },
            "专业技能": {
                id: "professional-skills",
                name: "专业技能",
                description: "提高工作效率和收入",
                maxLevel: 10,
                effects: {
                    incomeBonus: 0.15 // 每级收入提升倍率
                }
            },
            "理财能力": {
                id: "financial-skills",
                name: "理财能力",
                description: "提高资金管理和投资回报",
                maxLevel: 10,
                effects: {
                    investmentBonus: 0.1 // 每级投资回报提升倍率
                }
            }
        };
    }
    
    getSkillId(skillName) {
        if (this.skillDefinations[skillName]) {
            return this.skillDefinations[skillName].id;
        }
        return skillName.toLowerCase().replace(/\s+/g, '-');
    }
    
    updateSkills(character, timeAllocation) {
        // 根据时间分配更新技能进度
        
        // 学习时间影响学术基础技能
        if (!character.skills["学术基础"].locked) {
            const progressGain = timeAllocation.study * 1.2;
            character.addSkillProgress("学术基础", progressGain);
        }
        
        // 健身时间影响体育锻炼技能
        if (!character.skills["体育锻炼"].locked) {
            const progressGain = timeAllocation.fitness * 1.5;
            character.addSkillProgress("体育锻炼", progressGain);
        }
        
        // 社交时间影响社交能力技能
        if (!character.skills["社交能力"].locked) {
            const progressGain = timeAllocation.social * 1.5;
            character.addSkillProgress("社交能力", progressGain);
        }
        
        // 工作时间影响专业技能
        if (!character.skills["专业技能"].locked) {
            const progressGain = timeAllocation.work * 1.2;
            character.addSkillProgress("专业技能", progressGain);
        }
        
        // 应用技能效果
        this.applySkillEffects(character);
    }
    
    applySkillEffects(character) {
        // 应用学术基础技能效果
        if (character.skills["学术基础"] && character.skills["学术基础"].level > 0) {
            const baseBonus = this.skillDefinations["学术基础"].effects.intelligenceBonus;
            const bonus = baseBonus * character.skills["学术基础"].level;
            // 已经在进入下一年时应用了基础智力增长，这里只应用额外奖励
            character.attributes.intelligence += bonus;
        }
        
        // 应用体育锻炼技能效果
        if (character.skills["体育锻炼"] && character.skills["体育锻炼"].level > 0) {
            const fitnessBonus = this.skillDefinations["体育锻炼"].effects.fitnessBonus;
            const healthBonus = this.skillDefinations["体育锻炼"].effects.healthBonus;
            const fitnessIncrease = fitnessBonus * character.skills["体育锻炼"].level;
            const healthIncrease = healthBonus * character.skills["体育锻炼"].level;
            
            character.attributes.fitness += fitnessIncrease;
            character.attributes.health += healthIncrease;
        }
        
        // 应用社交能力技能效果
        if (character.skills["社交能力"] && character.skills["社交能力"].level > 0) {
            const charmBonus = this.skillDefinations["社交能力"].effects.charmBonus;
            const charmIncrease = charmBonus * character.skills["社交能力"].level;
            
            character.attributes.charm += charmIncrease;
        }
    }
    
    unlockSkill(skillName) {
        if (game.character.skills[skillName]) {
            game.character.skills[skillName].locked = false;
            game.addEventLog(`你解锁了${skillName}技能！`);
            return true;
        }
        return false;
    }
    
    // 检查并解锁新技能
    checkAndUnlockSkills(character) {
        // 根据年龄和属性解锁技能
        
        // 儿童期解锁学术基础和体育锻炼
        if (character.age >= 6) {
            this.unlockSkill("学术基础");
            this.unlockSkill("体育锻炼");
        }
        
        // 青少年期解锁社交能力
        if (character.age >= 12) {
            this.unlockSkill("社交能力");
        }
        
        // 大学期或社会期解锁专业技能
        if (character.age >= 18) {
            this.unlockSkill("专业技能");
        }
        
        // 社会期解锁理财能力
        if (character.lifeStage === "society" || character.age >= 22) {
            this.unlockSkill("理财能力");
        }
    }
}