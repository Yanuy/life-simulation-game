/**
 * events.js - 事件系统模块
 * 负责管理游戏中的随机事件和事件处理
 */

class EventSystem {
    constructor() {
        this.events = {
            '基础教育': [],
            '大学': [],
            '硕博': [],
            '社会': []
        };
        this.initializeEvents();
    }
    
    // 初始化事件库
    initializeEvents() {
        // 义务教育阶段事件
        this.registerEvent({
            id: 'elementary_school_exam',
            title: '期末考试',
            description: '学期末到了，你需要参加期末考试。',
            lifeStage: '义务教育',
            minAge: 6,
            maxAge: 12,
            probability: 0.8,
            options: [
                {
                    text: '认真复习',
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 5 },
                        { type: 'attribute', target: 'happiness', value: -5 },
                        { type: 'skill', target: 'academicBasics', value: 15 }
                    ]
                },
                {
                    text: '临时抱佛脚',
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 2 },
                        { type: 'attribute', target: 'happiness', value: -2 },
                        { type: 'skill', target: 'academicBasics', value: 5 }
                    ]
                },
                {
                    text: '不复习',
                    effects: [
                        { type: 'attribute', target: 'happiness', value: 5 },
                        { type: 'attribute', target: 'intelligence', value: -2 }
                    ]
                }
            ]
        });
        
        this.registerEvent({
            id: 'middle_school_exam',
            title: '中考',
            description: '初中毕业了，你需要参加中考决定你的高中去向。',
            lifeStage: '义务教育',
            minAge: 15,
            maxAge: 15,
            probability: 1,
            options: [
                {
                    text: '拼尽全力复习',
                    requirement: { attribute: 'intelligence', minValue: 40 },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 10 },
                        { type: 'attribute', target: 'happiness', value: -15 },
                        { type: 'attribute', target: 'health', value: -20 },
                        { type: 'skill', target: 'academicBasics', value: 30 },
                        { type: 'special', target: 'highSchoolTier', value: 'good' }
                    ]
                },
                {
                    text: '认真复习',
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 5 },
                        { type: 'attribute', target: 'happiness', value: -10 },
                        { type: 'attribute', target: 'health', value: -10 },
                        { type: 'skill', target: 'academicBasics', value: 20 },
                        { type: 'special', target: 'highSchoolTier', value: 'normal' }
                    ]
                },
                {
                    text: '一般复习',
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 2 },
                        { type: 'attribute', target: 'happiness', value: -5 },
                        { type: 'skill', target: 'academicBasics', value: 10 },
                        { type: 'special', target: 'highSchoolTier', value: 'normal' }
                    ]
                }
            ]
        });

        this.registerEvent({
            id: 'high_school_exam',
            title: '高考',
            description: '高中毕业了，你需要参加高考决定你的大学去向。',
            lifeStage: '义务教育',
            minAge: 18,
            maxAge: 18,
            probability: 1,
            options: [
                {
                    text: '拼命学习，争取考上名校',
                    requirement: { attribute: 'intelligence', minValue: 60 },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 15 },
                        { type: 'attribute', target: 'happiness', value: -20 },
                        { type: 'attribute', target: 'health', value: -30 },
                        { type: 'skill', target: 'academicBasics', value: 40 },
                        { type: 'special', target: 'collegeTier', value: 'top' }
                    ]
                },
                {
                    text: '认真复习，考上好大学',
                    requirement: { attribute: 'intelligence', minValue: 50 },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 10 },
                        { type: 'attribute', target: 'happiness', value: -15 },
                        { type: 'attribute', target: 'health', value: -20 },
                        { type: 'skill', target: 'academicBasics', value: 30 },
                        { type: 'special', target: 'collegeTier', value: 'good' }
                    ]
                },
                {
                    text: '一般复习，能上大学就行',
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 5 },
                        { type: 'attribute', target: 'happiness', value: -10 },
                        { type: 'attribute', target: 'health', value: -10 },
                        { type: 'skill', target: 'academicBasics', value: 15 },
                        { type: 'special', target: 'collegeTier', value: 'normal' }
                    ]
                },
                {
                    text: '放弃高考，直接工作',
                    effects: [
                        { type: 'attribute', target: 'happiness', value: 5 },
                        { type: 'special', target: 'skipCollege', value: true }
                    ]
                }
            ]
        });
        
        // 大学阶段事件
        this.registerEvent({
            id: 'college_club',
            title: '社团活动',
            description: '大学里有各种社团，你想加入哪一个？',
            lifeStage: '大学',
            minAge: 18,
            maxAge: 22,
            probability: 0.7,
            options: [
                {
                    text: '学术类社团',
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 10 },
                        { type: 'skill', target: 'academicBasics', value: 20 },
                        { type: 'attribute', target: 'charm', value: 5 }
                    ]
                },
                {
                    text: '体育类社团',
                    effects: [
                        { type: 'attribute', target: 'fitness', value: 15 },
                        { type: 'skill', target: 'physicalTraining', value: 25 },
                        { type: 'attribute', target: 'charm', value: 5 }
                    ]
                },
                {
                    text: '艺术类社团',
                    effects: [
                        { type: 'attribute', target: 'charm', value: 15 },
                        { type: 'skill', target: 'socialSkills', value: 20 },
                        { type: 'attribute', target: 'happiness', value: 10 }
                    ]
                },
                {
                    text: '不参加社团',
                    effects: [
                        { type: 'attribute', target: 'happiness', value: 5 }
                    ]
                }
            ]
        });
        
        this.registerEvent({
            id: 'college_internship',
            title: '实习机会',
            description: '你收到了一个实习机会，但会占用你的学习时间。',
            lifeStage: '大学',
            minAge: 20,
            maxAge: 22,
            probability: 0.6,
            options: [
                {
                    text: '接受实习，积累工作经验',
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 5 },
                        { type: 'skill', target: 'professionalSkills', value: 30 },
                        { type: 'money', value: 2000 },
                        { type: 'special', target: 'workExperience', value: 1 }
                    ]
                },
                {
                    text: '拒绝实习，专注学业',
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 10 },
                        { type: 'skill', target: 'academicBasics', value: 20 }
                    ]
                }
            ]
        });
        
        this.registerEvent({
            id: 'college_graduation',
            title: '大学毕业',
            description: '你即将大学毕业，需要决定未来的方向。',
            lifeStage: '大学',
            minAge: 22,
            maxAge: 22,
            probability: 1,
            options: [
                {
                    text: '申请研究生',
                    requirement: { attribute: 'intelligence', minValue: 70 },
                    effects: [
                        { type: 'special', target: 'applyMaster', value: true }
                    ]
                },
                {
                    text: '寻找工作',
                    effects: [
                        { type: 'special', target: 'findJob', value: true }
                    ]
                },
                {
                    text: '创业',
                    requirement: { 
                        attribute: 'intelligence', 
                        minValue: 60,
                        skill: 'professionalSkills',
                        minLevel: 3
                    },
                    effects: [
                        { type: 'special', target: 'startBusiness', value: true }
                    ]
                }
            ]
        });
        
        // 硕博阶段事件
        this.registerEvent({
            id: 'master_research',
            title: '研究项目',
            description: '你的导师邀请你参与一个重要的研究项目。',
            lifeStage: '硕博',
            minAge: 23,
            maxAge: 25,
            probability: 0.8,
            options: [
                {
                    text: '全力投入研究',
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 15 },
                        { type: 'skill', target: 'academicBasics', value: 30 },
                        { type: 'attribute', target: 'happiness', value: -10 },
                        { type: 'attribute', target: 'health', value: -15 },
                        { type: 'special', target: 'researchAchievement', value: true }
                    ]
                },
                {
                    text: '参与但保持生活平衡',
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 8 },
                        { type: 'skill', target: 'academicBasics', value: 15 },
                        { type: 'attribute', target: 'happiness', value: 5 }
                    ]
                },
                {
                    text: '婉拒，专注自己的研究方向',
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 5 },
                        { type: 'skill', target: 'academicBasics', value: 10 },
                        { type: 'attribute', target: 'happiness', value: 10 }
                    ]
                }
            ]
        });
        
        this.registerEvent({
            id: 'phd_opportunity',
            title: '博士机会',
            description: '你的研究表现优秀，有机会继续攻读博士学位。',
            lifeStage: '硕博',
            minAge: 25,
            maxAge: 25,
            probability: 0.7,
            requirement: { special: 'researchAchievement', value: true },
            options: [
                {
                    text: '继续攻读博士',
                    effects: [
                        { type: 'special', target: 'applyPhD', value: true }
                    ]
                },
                {
                    text: '硕士毕业后工作',
                    effects: [
                        { type: 'special', target: 'findJob', value: true }
                    ]
                }
            ]
        });
        
        // 社会阶段事件
        this.registerEvent({
            id: 'job_promotion',
            title: '工作晋升',
            description: '你在工作中表现出色，有机会获得晋升。',
            lifeStage: '社会',
            minAge: 25,
            maxAge: 60,
            probability: 0.3,
            requirement: { special: 'hasJob', value: true },
            options: [
                {
                    text: '接受晋升，承担更多责任',
                    effects: [
                        { type: 'attribute', target: 'happiness', value: -5 },
                        { type: 'money', value: 5000 },
                        { type: 'special', target: 'promotion', value: true }
                    ]
                },
                {
                    text: '保持现状，追求工作与生活平衡',
                    effects: [
                        { type: 'attribute', target: 'happiness', value: 10 },
                        { type: 'attribute', target: 'health', value: 5 }
                    ]
                }
            ]
        });
        
        this.registerEvent({
            id: 'investment_opportunity',
            title: '投资机会',
            description: '你遇到了一个投资机会，可能带来额外收入。',
            lifeStage: '社会',
            minAge: 25,
            maxAge: 60,
            probability: 0.2,
            options: [
                {
                    text: '谨慎投资',
                    requirement: { skill: 'financialSkills', minLevel: 2 },
                    effects: [
                        { type: 'money', value: 10000 },
                        { type: 'skill', target: 'financialSkills', value: 20 }
                    ]
                },
                {
                    text: '大胆投资',
                    effects: [
                        { type: 'random', outcomes: [
                            { probability: 0.3, effect: { type: 'money', value: 30000 } },
                            { probability: 0.7, effect: { type: 'money', value: -10000 } }
                        ]}
                    ]
                },
                {
                    text: '不投资',
                    effects: []
                }
            ]
        });
    }
    
    // 注册事件到事件库
    registerEvent(event) {
        if (event.lifeStage && this.events[event.lifeStage]) {
            this.events[event.lifeStage].push(event);
        }
    }
    
    // 获取当前生命阶段可能触发的事件
    getPossibleEvents(character) {
        const lifeStage = character.lifeStage;
        const age = character.age;
        
        if (!this.events[lifeStage]) {
            return [];
        }
        
        return this.events[lifeStage].filter(event => {
            // 检查年龄要求
            if ((event.minAge && age < event.minAge) || (event.maxAge && age > event.maxAge)) {
                return false;
            }
            
            // 检查特殊要求
            if (event.requirement) {
                if (event.requirement.attribute) {
                    const attrValue = character.attributes[event.requirement.attribute];
                    if (attrValue < event.requirement.minValue) {
                        return false;
                    }
                }
                
                if (event.requirement.skill) {
                    const skill = character.skills[event.requirement.skill];
                    if (!skill || skill.locked || skill.level < event.requirement.minLevel) {
                        return false;
                    }
                }
                
                if (event.requirement.special) {
                    // 特殊条件检查需要在游戏状态中实现
                    const specialValue = Game.getSpecialValue(event.requirement.special);
                    if (specialValue !== event.requirement.value) {
                        return false;
                    }
                }
            }
            
            return true;
        });
    }
    
    // 随机选择一个事件
    getRandomEvent(character) {
        const possibleEvents = this.getPossibleEvents(character);
        
        if (possibleEvents.length === 0) {
            return null;
        }
        
        // 根据概率筛选事件
        const eventPool = [];
        for (const event of possibleEvents) {
            const probability = event.probability || 0.5;
            if (Math.random() < probability) {
                eventPool.push(event);
            }
        }
        
        if (eventPool.length === 0) {
            return null;
        }
        
        // 随机选择一个事件
        return eventPool[Math.floor(Math.random() * eventPool.length)];
    }

// 处理事件选项效果
    processEventOption(character, option) {
        if (!option.effects) {
            return [];
        }

        const results = [];

        for (const effect of option.effects) {
            switch (effect.type) {
                case 'attribute':
                    if (character.attributes[effect.target]) {
                        character.attributes[effect.target] += effect.value;
                        character.attributes[effect.target] = Math.max(0, Math.min(100, character.attributes[effect.target]));
                        results.push(`${effect.target} ${effect.value > 0 ? '+' : ''}${effect.value}`);
                    }
                    break;

                case 'skill':
                    if (character.skills[effect.target] && !character.skills[effect.target].locked) {
                        character.gainSkillExperience(effect.target, effect.value);
                        results.push(`${effect.target} 经验 +${effect.value}`);
                    }
                    break;

                case 'money':
                    character.money += effect.value;
                    results.push(`金钱 ${effect.value > 0 ? '+' : ''}${effect.value}`);
                    break;

                case 'special':
                    // 特殊效果需要在游戏状态中处理
                    Game.setSpecialValue(effect.target, effect.value);
                    results.push(`特殊效果: ${effect.target} = ${effect.value}`);

                    // 更新教育状态标志
                    if (effect.target === 'collegeTier' && effect.value) {
                        character.education.hasCompletedHighSchool = true;
                        results.push(`完成高中教育`);
                    } else if (effect.target === 'applyMaster' && effect.value) {
                        character.education.hasCompletedCollege = true;
                        results.push(`完成大学教育`);
                    } else if (effect.target === 'applyPhD' && effect.value) {
                        character.education.hasMasterDegree = true;
                        results.push(`完成硕士教育`);
                    } else if (effect.target === 'skipCollege' && effect.value) {
                        character.education.hasCompletedHighSchool = true;
                        character.lifeStage = "社会"; // 直接进入社会
                        results.push(`跳过大学教育，直接进入社会`);
                    } else if (effect.target === 'findJob' && effect.value) {
                        // 根据当前阶段设置不同的状态
                        if (character.lifeStage === "大学") {
                            character.education.hasCompletedCollege = true;
                        } else if (character.lifeStage === "硕博") {
                            character.education.hasMasterDegree = true;
                        }
                        results.push(`找到工作`);
                    } else if (effect.target === 'hasJob') {
                        character.career.hasJob = effect.value;
                        results.push(`就业状态更新`);
                    }
                    break;

                case 'random':
                    // 处理随机效果
                    if (effect.outcomes && effect.outcomes.length > 0) {
                        const rand = Math.random();
                        let cumulativeProbability = 0;

                        for (const outcome of effect.outcomes) {
                            cumulativeProbability += outcome.probability;
                            if (rand < cumulativeProbability) {
                                // 递归处理随机结果中的效果
                                const subOption = { effects: [outcome.effect] };
                                const subResults = this.processEventOption(character, subOption);
                                results.push(...subResults);
                                break;
                            }
                        }
                    }
                    break;
            }
        }

        character.updateUI();
        return results;
    }
    
    // 显示事件模态框
    showEventModal(event, character) {
        const modal = document.getElementById('event-modal');
        const title = document.getElementById('event-title');
        const description = document.getElementById('event-description');
        const options = document.getElementById('event-options');
        
        title.textContent = event.title;
        description.textContent = event.description;
        options.innerHTML = '';
        
        for (const option of event.options) {
            // 检查选项要求
            let canChoose = true;
            if (option.requirement) {
                if (option.requirement.attribute) {
                    const attrValue = character.attributes[option.requirement.attribute];
                    if (attrValue < option.requirement.minValue) {
                        canChoose = false;
                    }
                }
                
                if (option.requirement.skill) {
                    const skill = character.skills[option.requirement.skill];
                    if (!skill || skill.locked || skill.level < option.requirement.minLevel) {
                        canChoose = false;
                    }
                }
            }
            
            const optionButton = document.createElement('button');
            optionButton.className = 'action-button event-option';
            optionButton.textContent = option.text;
            
            if (!canChoose) {
                optionButton.disabled = true;
                optionButton.title = '你不满足选择此选项的条件';
            } else {
                optionButton.addEventListener('click', () => {
                    const results = this.processEventOption(character, option);
                    
                    // 记录事件结果
                    Game.addEventLog(`事件: ${event.title}`);
                    Game.addEventLog(`选择: ${option.text}`);
                    for (const result of results) {
                        Game.addEventLog(`效果: ${result}`);
                    }
                    
                    // 关闭模态框
                    modal.style.display = 'none';
                });
            }
            
            options.appendChild(optionButton);
        }
        
        // 显示模态框
        modal.style.display = 'block';
        
        // 关闭按钮事件
        document.getElementById('close-event-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
}

// 导出EventSystem类
if (typeof module !== 'undefined') {
    module.exports = EventSystem;
}
