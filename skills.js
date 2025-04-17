/**
 * skills.js - 技能系统模块
 * 负责管理游戏中的技能树和技能升级
 */

class SkillSystem {
    constructor() {
        this.skills = {
            academicBasics: {
                name: '学术基础',
                description: '提高学习效率和考试成绩',
                levels: [
                    { requirement: 0, effect: '学习效率+5%' },
                    { requirement: 100, effect: '学习效率+10%, 考试成绩+5%' },
                    { requirement: 200, effect: '学习效率+15%, 考试成绩+10%' },
                    { requirement: 300, effect: '学习效率+20%, 考试成绩+15%' },
                    { requirement: 400, effect: '学习效率+25%, 考试成绩+20%' },
                    { requirement: 500, effect: '学习效率+30%, 考试成绩+25%' }
                ],
                unlockRequirements: null // 默认解锁
            },
            physicalTraining: {
                name: '体育锻炼',
                description: '提高体质和健康',
                levels: [
                    { requirement: 0, effect: '体质恢复+5%' },
                    { requirement: 100, effect: '体质恢复+10%, 健康+5%' },
                    { requirement: 200, effect: '体质恢复+15%, 健康+10%' },
                    { requirement: 300, effect: '体质恢复+20%, 健康+15%' },
                    { requirement: 400, effect: '体质恢复+25%, 健康+20%' },
                    { requirement: 500, effect: '体质恢复+30%, 健康+25%' }
                ],
                unlockRequirements: null // 默认解锁
            },
            socialSkills: {
                name: '社交能力',
                description: '提高魅力和人际关系',
                levels: [
                    { requirement: 0, effect: '魅力+5%' },
                    { requirement: 100, effect: '魅力+10%, 关系提升+5%' },
                    { requirement: 200, effect: '魅力+15%, 关系提升+10%' },
                    { requirement: 300, effect: '魅力+20%, 关系提升+15%' },
                    { requirement: 400, effect: '魅力+25%, 关系提升+20%' },
                    { requirement: 500, effect: '魅力+30%, 关系提升+25%' }
                ],
                unlockRequirements: { minAge: 12 } // 12岁后解锁或通过特定物品解锁
            },
            professionalSkills: {
                name: '专业技能',
                description: '提高工作效率和收入',
                levels: [
                    { requirement: 0, effect: '工作效率+5%' },
                    { requirement: 100, effect: '工作效率+10%, 收入+5%' },
                    { requirement: 200, effect: '工作效率+15%, 收入+10%' },
                    { requirement: 300, effect: '工作效率+20%, 收入+15%' },
                    { requirement: 400, effect: '工作效率+25%, 收入+20%' },
                    { requirement: 500, effect: '工作效率+30%, 收入+25%' }
                ],
                unlockRequirements: { minAge: 18, lifeStage: '大学' } // 大学阶段解锁
            },
            financialSkills: {
                name: '理财能力',
                description: '提高资金管理和投资回报',
                levels: [
                    { requirement: 0, effect: '投资回报+5%' },
                    { requirement: 100, effect: '投资回报+10%, 消费折扣+5%' },
                    { requirement: 200, effect: '投资回报+15%, 消费折扣+10%' },
                    { requirement: 300, effect: '投资回报+20%, 消费折扣+15%' },
                    { requirement: 400, effect: '投资回报+25%, 消费折扣+20%' },
                    { requirement: 500, effect: '投资回报+30%, 消费折扣+25%' }
                ],
                unlockRequirements: { minAge: 18 } // 18岁后解锁或通过特定物品解锁
            }
        };
    }
    
    // 检查技能是否可以解锁
    canUnlockSkill(skillId, character) {
        const skill = this.skills[skillId];
        if (!skill || !skill.unlockRequirements) {
            return true; // 没有要求或技能不存在
        }
        
        const requirements = skill.unlockRequirements;
        
        // 检查年龄要求
        if (requirements.minAge && character.age < requirements.minAge) {
            return false;
        }
        
        // 检查生命阶段要求
        if (requirements.lifeStage && character.lifeStage !== requirements.lifeStage) {
            return false;
        }
        
        // 检查属性要求
        if (requirements.attributes) {
            for (const [attr, minValue] of Object.entries(requirements.attributes)) {
                if (character.attributes[attr] < minValue) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // 尝试解锁技能
    tryUnlockSkills(character) {
        for (const skillId in this.skills) {
            if (character.skills[skillId] && character.skills[skillId].locked) {
                if (this.canUnlockSkill(skillId, character)) {
                    character.unlockSkill(skillId);
                    Game.addEventLog(`解锁了技能: ${this.skills[skillId].name}`);
                }
            }
        }
    }
    
    // 获取技能等级描述
    getSkillLevelDescription(skillId, level) {
        const skill = this.skills[skillId];
        if (!skill) {
            return '';
        }
        
        // 找到当前等级的描述
        for (let i = skill.levels.length - 1; i >= 0; i--) {
            if (level >= Math.floor(skill.levels[i].requirement / 100)) {
                return skill.levels[i].effect;
            }
        }
        
        return skill.levels[0].effect;
    }
    
    // 渲染技能树
    renderSkillTree(character) {
        const container = document.getElementById('skills-container');
        container.innerHTML = '';
        
        for (const skillId in this.skills) {
            const skill = this.skills[skillId];
            const characterSkill = character.skills[skillId];
            
            const skillElement = document.createElement('div');
            skillElement.className = 'skill-item';
            if (characterSkill.locked) {
                skillElement.classList.add('locked');
            }
            
            const levelDescription = characterSkill.locked ? '未解锁' : this.getSkillLevelDescription(skillId, characterSkill.level);
            
            skillElement.innerHTML = `
                <div class="skill-name">${skill.name} (Level <span id="${skillId.replace(/([A-Z])/g, '-$1').toLowerCase()}-level">${characterSkill.level}</span>)</div>
                <div class="progress-bar">
                    <div class="progress-fill" id="${skillId.replace(/([A-Z])/g, '-$1').toLowerCase()}-progress" style="width: ${characterSkill.locked ? 0 : characterSkill.experience}%;"></div>
                </div>
                <div class="skill-description">${skill.description}</div>
                <div class="skill-effect">${levelDescription}</div>
            `;
            
            container.appendChild(skillElement);
        }
    }
    
    // 初始化时间分配监听器
    initializeTimeAllocationListeners(character) {
        const timeSliders = document.querySelectorAll('.time-slider');
        const saveButton = document.getElementById('save-time-allocation');
        
        // 更新时间分配显示
        const updateTimeDisplay = () => {
            let total = 0;
            
            timeSliders.forEach(slider => {
                const value = parseInt(slider.value);
                const id = slider.id;
                const activity = id.replace('-time', '');
                
                document.getElementById(`${id}-value`).textContent = `${value}%`;
                total += value;
            });
            
            const remaining = 100 - total;
            document.getElementById('remaining-time-value').textContent = `${remaining}%`;
            
            // 如果总和超过100%，禁用保存按钮
            if (total > 100) {
                saveButton.disabled = true;
                saveButton.title = '时间分配总和不能超过100%';
                document.getElementById('remaining-time-value').style.color = 'red';
            } else {
                saveButton.disabled = false;
                saveButton.title = '';
                document.getElementById('remaining-time-value').style.color = '';
            }
        };
        
        // 为每个滑块添加事件监听器
        timeSliders.forEach(slider => {
            slider.addEventListener('input', updateTimeDisplay);
        });
        
        // 保存时间分配
        saveButton.addEventListener('click', () => {
            const allocation = {};
            let total = 0;
            
            timeSliders.forEach(slider => {
                const value = parseInt(slider.value);
                const activity = slider.id.replace('-time', '');
                allocation[activity] = value;
                total += value;
            });
            
            if (total <= 100) {
                character.setTimeAllocation(allocation);
                Game.addEventLog('保存了时间分配');
            }
        });
        
        // 初始化显示
        updateTimeDisplay();
    }
}

// 导出SkillSystem类
if (typeof module !== 'undefined') {
    module.exports = SkillSystem;
}
