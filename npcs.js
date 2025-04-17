/**
 * npcs.js - NPC模块
 * 负责管理游戏中的NPC角色和互动
 */

class NPC {
    constructor(id, name, description, lifeStage, relationship = 0, interactions = [], requirements = {}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.lifeStage = lifeStage; // 生命阶段：义务教育、大学、硕博、社会
        this.relationship = relationship; // 关系值，0-100
        this.interactions = interactions; // 可执行的互动
        this.requirements = requirements; // NPC出现要求
    }
    
    // 检查NPC是否可用
    isAvailable(character) {
        // 检查生命阶段
        if (this.lifeStage !== 'all' && this.lifeStage && character.lifeStage !== this.lifeStage) {
            return false;
        }
        
        // 检查年龄要求
        if (this.requirements.minAge && character.age < this.requirements.minAge) {
            return false;
        }
        if (this.requirements.maxAge && character.age > this.requirements.maxAge) {
            return false;
        }
        
        // 检查特殊要求
        if (this.requirements.special) {
            for (const [key, value] of Object.entries(this.requirements.special)) {
                if (Game.getSpecialValue(key) !== value) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // 执行互动
    interact(interactionId, character) {
        const interaction = this.interactions.find(i => i.id === interactionId);
        if (!interaction) {
            return {
                success: false,
                message: "互动不存在"
            };
        }
        
        // 检查互动要求
        if (interaction.requirements) {
            // 检查关系值要求
            if (interaction.requirements.minRelationship && this.relationship < interaction.requirements.minRelationship) {
                return {
                    success: false,
                    message: `你与${this.name}的关系不够好，无法执行此互动`
                };
            }
            
            // 检查属性要求
            if (interaction.requirements.attributes) {
                for (const [attr, minValue] of Object.entries(interaction.requirements.attributes)) {
                    if (character.attributes[attr] < minValue) {
                        return {
                            success: false,
                            message: `你的${attr}不足，无法执行此互动`
                        };
                    }
                }
            }
            
            // 检查时间要求
            if (interaction.requirements.time && character.timeAllocation.remaining < interaction.requirements.time) {
                return {
                    success: false,
                    message: "你的时间不足，无法执行此互动"
                };
            }
        }
        
        // 应用互动效果
        const results = [];
        
        if (interaction.effects) {
            for (const effect of interaction.effects) {
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
                        
                    case 'time':
                        character.timeAllocation.remaining -= effect.value;
                        results.push(`时间 -${effect.value}%`);
                        break;
                        
                    case 'relationship':
                        this.relationship += effect.value;
                        this.relationship = Math.max(0, Math.min(100, this.relationship));
                        results.push(`与${this.name}的关系 ${effect.value > 0 ? '+' : ''}${effect.value}`);
                        break;
                        
                    case 'special':
                        Game.setSpecialValue(effect.target, effect.value);
                        results.push(`特殊效果: ${effect.target} = ${effect.value}`);
                        break;
                }
            }
        }
        
        // 更新UI
        character.updateUI();
        
        return {
            success: true,
            message: interaction.resultText || `与${this.name}互动`,
            effects: results
        };
    }
    
    // 获取关系描述
    getRelationshipDescription() {
        if (this.relationship >= 90) {
            return "亲密无间";
        } else if (this.relationship >= 70) {
            return "亲密";
        } else if (this.relationship >= 50) {
            return "友好";
        } else if (this.relationship >= 30) {
            return "一般";
        } else if (this.relationship >= 10) {
            return "疏远";
        } else {
            return "陌生";
        }
    }
}

class NPCManager {
    constructor() {
        this.npcs = {};
        this.initializeNPCs();
    }
    
    // 初始化NPC库
    initializeNPCs() {
        // 义务教育阶段NPC
        this.registerNPC(new NPC(

            'elementary_teacher',
            '小学老师',
            '你的小学班主任，负责教导你基础知识。',
            '义务教育',
            30,
            [
                {
                    id: 'ask_question',
                    name: '请教问题',
                    description: '向老师请教学习上的问题',
                    requirements: { time: 5 },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 3 },
                        { type: 'skill', target: 'academicBasics', value: 8 },
                        { type: 'relationship', value: 2 },
                        { type: 'time', value: 5 }
                    ],
                    resultText: '你向老师请教了问题，获得了知识，与老师的关系也更好了。'
                },
                {
                    id: 'help_teacher',
                    name: '帮助老师',
                    description: '帮助老师做一些事情',
                    requirements: { time: 3 },
                    effects: [
                        { type: 'relationship', value: 5 },
                        { type: 'attribute', target: 'charm', value: 2 },
                        { type: 'time', value: 3 }
                    ],
                    resultText: '你帮助老师做了一些事情，老师很感谢你。'
                }
            ],
            { minAge: 6, maxAge: 12 }
        ));
        // 父母NPC
        this.registerNPC(new NPC(
            'father',
            '父亲',
            '你关心的父亲，照顾你成长，给你很多的支持。',
            'all',
            50,
            [
                {
                    id: 'talk_about_day',
                    name: '谈论一天的事情',
                    description: '和父亲聊聊你今天发生的事情',
                    requirements: { time: 10 },
                    effects: [
                        { type: 'attribute', target: 'happiness', value: 5 },
                        { type: 'relationship', value: 5 },
                        { type: 'time', value: 10 }
                    ],
                    resultText: '你和父亲聊了聊今天的事情，增进了彼此的理解和感情。'
                },
                {
                    id: 'help_father',
                    name: '帮助父亲',
                    description: '帮父亲做些家务或工作',
                    requirements: { time: 8 },
                    effects: [
                        { type: 'attribute', target: 'charm', value: 2 },
                        { type: 'relationship', value: 6 },
                        { type: 'time', value: 8 }
                    ],
                    resultText: '你帮父亲做了一些事情，他非常高兴，并感谢你。'
                },
                {
                    id: 'ask_allowance',
                    name: '索要零花钱',
                    description: '向父亲索要零花钱，看看他会不会给你。',
                    requirements: { time: 3 },
                    effects: [
                        { type: 'relationship', value: 2 },
                        { type: 'money', value: 100 },
                        { type: 'time', value: 3 }
                    ],
                    resultText: '你向父亲索要零花钱，父亲虽然有些无奈，但最终给了你一些钱。'
                }
            ],
            { minAge: 0, maxAge: 100 }
        ));

        this.registerNPC(new NPC(
            'mother',
            '母亲',
            '你深爱的母亲，总是关心着你的生活。',
            'all',
            50,
            [
                {
                    id: 'talk_about_day',
                    name: '谈论一天的事情',
                    description: '和母亲分享你的日常。',
                    requirements: { time: 10 },
                    effects: [
                        { type: 'attribute', target: 'happiness', value: 5 },
                        { type: 'relationship', value: 5 },
                        { type: 'time', value: 10 }
                    ],
                    resultText: '你和母亲聊了聊今天的事情，感觉心情愉快。'
                },
                {
                    id: 'help_mother',
                    name: '帮助母亲',
                    description: '帮母亲做些家务或者照顾家庭',
                    requirements: { time: 8 },
                    effects: [
                        { type: 'attribute', target: 'charm', value: 2 },
                        { type: 'relationship', value: 6 },
                        { type: 'time', value: 8 }
                    ],
                    resultText: '你帮母亲做了家务，母亲非常高兴并感谢你。'
                },
                {
                    id: 'ask_allowance',
                    name: '索要零花钱',
                    description: '向母亲索要零花钱，看看她是否愿意给你。',
                    requirements: { time: 3 },
                    effects: [
                        { type: 'relationship', value: 2 },
                        { type: 'money', value: 50 },
                        { type: 'time', value: 3 }
                    ],
                    resultText: '你向母亲索要零花钱，母亲有些心软，最终给了你一些钱。'
                }
            ],
            { minAge: 0, maxAge: 100 }
        ));
        this.registerNPC(new NPC(
            'elementary_classmate',
            '小学同学',
            '你的小学同班同学，可以一起学习和玩耍。',
            '义务教育',
            20,
            [
                {
                    id: 'play_together',
                    name: '一起玩耍',
                    description: '和同学一起游戏',
                    requirements: { time: 5 },
                    effects: [
                        { type: 'attribute', target: 'happiness', value: 5 },
                        { type: 'relationship', value: 3 },
                        { type: 'time', value: 5 }
                    ],
                    resultText: '你和同学一起玩耍，度过了愉快的时光。'
                },
                {
                    id: 'study_together',
                    name: '一起学习',
                    description: '和同学一起复习功课',
                    requirements: { time: 8 },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 2 },
                        { type: 'skill', target: 'academicBasics', value: 5 },
                        { type: 'relationship', value: 2 },
                        { type: 'time', value: 8 }
                    ],
                    resultText: '你和同学一起学习，互相帮助，提高了学习效率。'
                }
            ],
            { minAge: 6, maxAge: 12 }
        ));
        // 初中阶段NPC
        this.registerNPC(new NPC(
            'middle_school_teacher',
            '初中老师',
            '你的初中班主任，负责教导你各类学科知识。',
            '义务教育',
            35,
            [
                {
                    id: 'ask_advice',
                    name: '请教学科问题',
                    description: '向老师请教学科上的疑问，获得更深入的理解。',
                    requirements: { time: 6 },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 4 },
                        { type: 'skill', target: 'academicBasics', value: 12 },
                        { type: 'relationship', value: 4 },
                        { type: 'time', value: 6 }
                    ],
                    resultText: '你向老师请教了学科问题，收获了更多的知识和启发。'
                },
                {
                    id: 'class_participation',
                    name: '积极参与课堂',
                    description: '在课堂上积极举手发言，展示自己对知识的掌握。',
                    requirements: { time: 4 },
                    effects: [
                        { type: 'attribute', target: 'confidence', value: 3 },
                        { type: 'relationship', value: 2 },
                        { type: 'time', value: 4 }
                    ],
                    resultText: '你在课堂上积极发言，增加了自信，老师对你的印象更好。'
                }
            ],
            { minAge: 12, maxAge: 15 }
        ));

        this.registerNPC(new NPC(
            'middle_school_classmate',
            '初中同学',
            '你的初中同班同学，可以一起讨论学科问题。',
            '义务教育',
            25,
            [
                {
                    id: 'study_group',
                    name: '一起做题',
                    description: '和同学一起做作业或复习考试题目，提升学业水平。',
                    requirements: { time: 7 },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 3 },
                        { type: 'skill', target: 'academicBasics', value: 7 },
                        { type: 'relationship', value: 3 },
                        { type: 'time', value: 7 }
                    ],
                    resultText: '你和同学一起做了题目，互相讨论，进步了不少。'
                },
                {
                    id: 'share_experience',
                    name: '分享学习经验',
                    description: '和同学交流学习技巧与方法。',
                    requirements: { time: 5 },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 2 },
                        { type: 'skill', target: 'academicBasics', value: 5 },
                        { type: 'relationship', value: 3 },
                        { type: 'time', value: 5 }
                    ],
                    resultText: '你分享了自己的学习经验，同学们也受益匪浅。'
                }
            ],
            { minAge: 12, maxAge: 15 }
        ));
        this.registerNPC(new NPC(
            'high_school_teacher',
            '高中老师',
            '你的高中班主任，严厉但负责任。',
            '义务教育',
            25,
            [
                {
                    id: 'ask_guidance',
                    name: '请教指导',
                    description: '向老师请教学习方法和高考指导',
                    requirements: { time: 5 },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 4 },
                        { type: 'skill', target: 'academicBasics', value: 10 },
                        { type: 'relationship', value: 3 },
                        { type: 'time', value: 5 }
                    ],
                    resultText: '老师给了你很多学习建议和高考指导，对你很有帮助。'
                },
                {
                    id: 'extra_assignment',
                    name: '额外作业',
                    description: '请老师布置额外的练习题',
                    requirements: { time: 10, minRelationship: 40 },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 6 },
                        { type: 'skill', target: 'academicBasics', value: 15 },
                        { type: 'attribute', target: 'happiness', value: -3 },
                        { type: 'relationship', value: 5 },
                        { type: 'time', value: 10 }
                    ],
                    resultText: '老师为你布置了额外的练习题，虽然辛苦但收获很大。'
                }
            ],
            { minAge: 15, maxAge: 18 }
        ));
        this.registerNPC(new NPC(
            'high_school_classmate',
            '高中同学',
            '你的高中同班同学，可以一起讨论问题，也能一起参加课外活动。',
            '义务教育',
            20,
            [
                {
                    id: 'study_group',
                    name: '学习小组',
                    description: '和同学一起组成学习小组，共同复习考试',
                    requirements: { time: 6 },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 3 },
                        { type: 'skill', target: 'academicAdvanced', value: 6 },
                        { type: 'relationship', value: 4 },
                        { type: 'time', value: 6 }
                    ],
                    resultText: '你和同学一起复习，互相讨论，提升了自己的成绩。'
                },
                {
                    id: 'sports_activity',
                    name: '课外活动',
                    description: '和同学一起参加课外活动，放松身心',
                    requirements: { time: 7 },
                    effects: [
                        { type: 'attribute', target: 'happiness', value: 7 },
                        { type: 'relationship', value: 5 },
                        { type: 'time', value: 7 }
                    ],
                    resultText: '你和同学一起参加了体育活动，增进了友谊，身心得到了放松。'
                }
            ],
            { minAge: 15, maxAge: 18 }
        ));

        // 高中优秀同学
        this.registerNPC(new NPC(
            'high_school_top_student',
            '高中优秀同学',
            '成绩好，经常分享学习经验。',
            '义务教育',
            22,
            [
                {
                    id: 'ask_study_tips',
                    name: '请教学习方法',
                    description: '向学霸请教学习方法和技巧',
                    requirements: { time: 4 },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 5 },
                        { type: 'skill', target: 'academicAdvanced', value: 8 },
                        { type: 'relationship', value: 2 },
                        { type: 'time', value: 4 }
                    ],
                    resultText: '你向学霸请教了学习方法，收获了许多实用的技巧，学习效率提升。'
                },
                {
                    id: 'study_together',
                    name: '一起学习',
                    description: '和学霸一起学习，学习氛围十分浓厚',
                    requirements: { time: 8 },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 6 },
                        { type: 'skill', target: 'academicAdvanced', value: 10 },
                        { type: 'relationship', value: 4 },
                        { type: 'time', value: 8 }
                    ],
                    resultText: '你和学霸一起学习，互相帮助，进步了很多。'
                }
            ],
            { minAge: 15, maxAge: 18 }
        ));
        this.registerNPC(new NPC(
            'graduate_classmate',
            '毕业同学',
            '和你一同毕业的同学，现在可能已经有了各自的职业。',
            '社会',
            30,
            [
                {
                    id: 'networking',
                    name: '建立联系',
                    description: '与毕业后的同学建立联系，交换近况。',
                    requirements: { time: 3 },
                    effects: [
                        { type: 'relationship', value: 5 },
                        { type: 'time', value: 3 }
                    ],
                    resultText: '你和毕业同学联系上了，互相了解了彼此的近况。'
                },
                {
                    id: 'career_advice',
                    name: '职业建议',
                    description: '向已经进入职场的同学请教职业发展的建议。',
                    requirements: { time: 6 },
                    effects: [
                        { type: 'attribute', target: 'confidence', value: 3 },
                        { type: 'relationship', value: 4 },
                        { type: 'time', value: 6 }
                    ],
                    resultText: '同学给了你很多关于职场的建议，你受益匪浅。'
                }
            ],
            { minAge: 18 }
        ));
        // 大学阶段NPC
        this.registerNPC(new NPC(
            'university_professor',
            '大学教授',
            '你的专业课教授，学识渊博。',
            '大学',
            20,
            [
                {
                    id: 'academic_discussion',
                    name: '学术讨论',
                    description: '与教授讨论学术问题',
                    requirements: { time: 8, attributes: { intelligence: 50 } },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 5 },
                        { type: 'skill', target: 'academicBasics', value: 15 },
                        { type: 'relationship', value: 5 },
                        { type: 'time', value: 8 }
                    ],
                    resultText: '你与教授进行了深入的学术讨论，获得了很多专业知识。'
                },
                {
                    id: 'research_assistant',
                    name: '担任助研',
                    description: '申请成为教授的研究助理',
                    requirements: { time: 15, minRelationship: 50, attributes: { intelligence: 60 } },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 8 },
                        { type: 'skill', target: 'academicBasics', value: 20 },
                        { type: 'skill', target: 'professionalSkills', value: 15 },
                        { type: 'money', value: 1500 },
                        { type: 'relationship', value: 10 },
                        { type: 'time', value: 15 }
                    ],
                    resultText: '你成为了教授的研究助理，参与了研究项目，获得了宝贵的经验和一些报酬。'
                }
            ],
            { minAge: 18, maxAge: 22 }
        ));
        
        this.registerNPC(new NPC(
            'university_friend',
            '大学好友',
            '你在大学认识的好朋友，志同道合。',
            '大学',
            40,
            [
                {
                    id: 'hang_out',
                    name: '一起出游',
                    description: '和朋友一起外出游玩',
                    requirements: { time: 10, money: 200 },
                    effects: [
                        { type: 'attribute', target: 'happiness', value: 10 },
                        { type: 'attribute', target: 'charm', value: 3 },
                        { type: 'relationship', value: 5 },
                        { type: 'money', value: -200 },
                        { type: 'time', value: 10 }
                    ],
                    resultText: '你和朋友一起出游，度过了愉快的时光，心情大好。'
                },
                {
                    id: 'study_group',
                    name: '组织学习小组',
                    description: '和朋友一起组织学习小组',
                    requirements: { time: 12 },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 5 },
                        { type: 'skill', target: 'academicBasics', value: 12 },
                        { type: 'skill', target: 'socialSkills', value: 8 },
                        { type: 'relationship', value: 3 },
                        { type: 'time', value: 12 }
                    ],
                    resultText: '你们组织了学习小组，互相帮助，共同提高。'
                }
            ],
            { minAge: 18, maxAge: 22 }
        ));
        
        // 硕博阶段NPC
        this.registerNPC(new NPC(
            'graduate_advisor',
            '研究生导师',
            '你的研究生导师，指导你的学术研究。',
            '硕博',
            30,
            [
                {
                    id: 'research_guidance',
                    name: '研究指导',
                    description: '请教导师关于研究方向的指导',
                    requirements: { time: 8 },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 6 },
                        { type: 'skill', target: 'academicBasics', value: 18 },
                        { type: 'relationship', value: 3 },
                        { type: 'time', value: 8 }
                    ],
                    resultText: '导师给了你很多关于研究方向的宝贵建议。'
                },
                {
                    id: 'paper_collaboration',
                    name: '论文合作',
                    description: '与导师合作撰写学术论文',
                    requirements: { time: 20, minRelationship: 60, attributes: { intelligence: 70 } },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 10 },
                        { type: 'skill', target: 'academicBasics', value: 30 },
                        { type: 'relationship', value: 8 },
                        { type: 'special', target: 'academicPublication', value: true },
                        { type: 'time', value: 20 }
                    ],
                    resultText: '你与导师合作撰写了学术论文，提升了学术能力，也增进了与导师的关系。'
                }
            ],
            { minAge: 22, maxAge: 28 }
        ));
        
        // 社会阶段NPC
        this.registerNPC(new NPC(
            'work_colleague',
            '工作同事',
            '你的工作同事，一起共事的伙伴。',
            '社会',
            30,
            [
                {
                    id: 'lunch_together',
                    name: '一起午餐',
                    description: '和同事一起吃午餐，聊聊工作和生活',
                    requirements: { time: 5, money: 100 },
                    effects: [
                        { type: 'attribute', target: 'happiness', value: 5 },
                        { type: 'attribute', target: 'charm', value: 2 },
                        { type: 'relationship', value: 3 },
                        { type: 'money', value: -100 },
                        { type: 'time', value: 5 }
                    ],
                    resultText: '你和同事一起吃午餐，聊了很多话题，关系更加融洽。'
                },
                {
                    id: 'work_cooperation',
                    name: '工作合作',
                    description: '与同事合作完成工作项目',
                    requirements: { time: 15, minRelationship: 40 },
                    effects: [
                        { type: 'skill', target: 'professionalSkills', value: 15 },
                        { type: 'skill', target: 'socialSkills', value: 10 },
                        { type: 'relationship', value: 5 },
                        { type: 'special', target: 'workPerformance', value: true },
                        { type: 'time', value: 15 }
                    ],
                    resultText: '你与同事成功合作完成了工作项目，提升了专业能力，也增进了合作关系。'
                }
            ],
            { minAge: 22 }
        ));
        
        this.registerNPC(new NPC(
            'work_boss',
            '公司上司',
            '你的直接上级，对你的工作表现有重要影响。',
            '社会',
            20,
            [
                {
                    id: 'work_report',
                    name: '工作汇报',
                    description: '向上司汇报工作进展',
                    requirements: { time: 5 },
                    effects: [
                        { type: 'relationship', value: 2 },
                        { type: 'time', value: 5 }
                    ],
                    resultText: '你向上司汇报了工作进展，上司对你的工作有了更多了解。'
                },
                {
                    id: 'extra_effort',
                    name: '加班加点',
                    description: '主动加班完成重要任务',
                    requirements: { time: 20 },
                    effects: [
                        { type: 'attribute', target: 'happiness', value: -8 },
                        { type: 'attribute', target: 'health', value: -5 },
                        { type: 'skill', target: 'professionalSkills', value: 20 },
                        { type: 'relationship', value: 10 },
                        { type: 'special', target: 'promotionChance', value: true },
                        { type: 'time', value: 20 }
                    ],
                    resultText: '你加班加点完成了重要任务，虽然很累，但上司对你的印象大大提升。'
                }
            ],
            { minAge: 22}
        ));
    }
    
    // 注册NPC到NPC库
    registerNPC(npc) {
        this.npcs[npc.id] = npc;
    }
    
    // 获取当前可用NPC列表
    getAvailableNPCs(character) {
        const availableNPCs = [];

        for (const npcId in this.npcs) {
            if (Object.prototype.hasOwnProperty.call(this.npcs, npcId)) {
                const npc = this.npcs[npcId];
                if (npc.isAvailable(character)) {
                    availableNPCs.push(npc);
                }
            }
        }

        return availableNPCs;
    }
    
    // 渲染NPC列表
    renderNPCList(character) {
        const container = document.getElementById('relations-container');
        container.innerHTML = '';
        
        const availableNPCs = this.getAvailableNPCs(character);
        
        if (availableNPCs.length === 0) {
            container.innerHTML = '<div class="empty-npcs">当前没有可互动的人物</div>';
            return;
        }
        
        for (const npc of availableNPCs) {
            const npcElement = document.createElement('div');
            npcElement.className = 'npc';
            npcElement.dataset.npcId = npc.id;
            
            npcElement.innerHTML = `
                <div class="npc-name">${npc.name}</div>
                <div class="npc-description">${npc.description}</div>
                <div class="npc-relationship">关系: ${npc.getRelationshipDescription()} (${npc.relationship})</div>
            `;
            
            npcElement.addEventListener('click', () => {
                this.showInteractionModal(npc, character);
            });
            
            container.appendChild(npcElement);
        }
    }
    
    // 显示互动模态框
    showInteractionModal(npc, character) {
        const modal = document.getElementById('interaction-modal');
        const title = document.getElementById('interaction-title');
        const container = document.getElementById('interaction-container');
        
        title.textContent = `与 ${npc.name} 互动`;
        container.innerHTML = '';
        
        // NPC信息
        const npcInfo = document.createElement('div');
        npcInfo.className = 'npc-info';
        npcInfo.innerHTML = `
            <div class="npc-description">${npc.description}</div>
            <div class="npc-relationship">关系: ${npc.getRelationshipDescription()} (${npc.relationship})</div>
        `;
        container.appendChild(npcInfo);
        
        // 互动选项
        const interactionsContainer = document.createElement('div');
        interactionsContainer.className = 'interactions-container';
        
        for (const interaction of npc.interactions) {
            // 检查互动要求
            let canInteract = true;
            let requirementText = '';
            
            if (interaction.requirements) {
                // 检查关系值要求
                if (interaction.requirements.minRelationship && npc.relationship < interaction.requirements.minRelationship) {
                    canInteract = false;
                    requirementText = `需要关系值达到${interaction.requirements.minRelationship}`;
                }
                
                // 检查时间要求
                if (interaction.requirements.time && character.timeAllocation.remaining < interaction.requirements.time) {
                    canInteract = false;
                    requirementText = `需要${interaction.requirements.time}%的时间`;
                }
                
                // 检查金钱要求
                if (interaction.requirements.money && character.money < interaction.requirements.money) {
                    canInteract = false;
                    requirementText = `需要¥${interaction.requirements.money}`;
                }
                
                // 检查属性要求
                if (interaction.requirements.attributes) {
                    for (const [attr, minValue] of Object.entries(interaction.requirements.attributes)) {
                        if (character.attributes[attr] < minValue) {
                            canInteract = false;
                            requirementText = `需要${attr}达到${minValue}`;
                            break;
                        }
                    }
                }
            }
            
            const interactionElement = document.createElement('div');
            interactionElement.className = 'interaction-option';
            
            const interactionButton = document.createElement('button');
            interactionButton.className = 'action-button interaction-button';
            interactionButton.textContent = interaction.name;
            
            if (!canInteract) {
                interactionButton.disabled = true;
                interactionButton.title = requirementText;
            } else {
                interactionButton.addEventListener('click', () => {
                    const result = npc.interact(interaction.id, character);
                    
                    if (result.success) {
                        Game.addEventLog(result.message);
                        if (result.effects) {
                            for (const effect of result.effects) {
                                Game.addEventLog(`效果: ${effect}`);
                            }
                        }
                        
                        // 更新互动模态框
                        this.showInteractionModal(npc, character);
                    } else {
                        Game.addEventLog(result.message);
                    }
                });
            }
            
            const interactionDescription = document.createElement('div');
            interactionDescription.className = 'interaction-description';
            interactionDescription.textContent = interaction.description;
            
            interactionElement.appendChild(interactionButton);
            interactionElement.appendChild(interactionDescription);
            
            if (!canInteract) {
                const requirementElement = document.createElement('div');
                requirementElement.className = 'interaction-requirement';
                requirementElement.textContent = requirementText;
                interactionElement.appendChild(requirementElement);
            }
            
            interactionsContainer.appendChild(interactionElement);
        }
        
        container.appendChild(interactionsContainer);
        
        // 显示模态框
        modal.style.display = 'block';
        
        // 关闭按钮事件
        document.getElementById('close-interaction-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
}

// 导出NPCManager类
if (typeof module !== 'undefined') {
    module.exports = { NPC, NPCManager };
}
