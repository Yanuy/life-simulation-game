/**
 * scenes.js - 场景模块
 * 负责管理游戏中的场景和场景交互
 */

class Scene {
    constructor(id, name, description, lifeStage, actions = [], requirements = {}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.lifeStage = lifeStage; // 生命阶段：义务教育、大学、硕博、社会
        this.actions = actions; // 可执行的操作
        this.requirements = requirements; // 场景解锁要求
    }
    
    // 检查场景是否可用
    isAvailable(character) {
        // 检查生命阶段
        if (this.lifeStage !== "all" && character.lifeStage !== this.lifeStage) {
            return false;
        }
        
        // 检查年龄要求
        if (this.requirements.minAge && character.age < this.requirements.minAge) {
            return false;
        }
        if (this.requirements.maxAge && character.age > this.requirements.maxAge) {
            return false;
        }
        
        // 检查属性要求
        if (this.requirements.attributes) {
            for (const [attr, minValue] of Object.entries(this.requirements.attributes)) {
                if (character.attributes[attr] < minValue) {
                    return false;
                }
            }
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
    
    // 执行场景操作
    performAction(actionId, character) {
        const action = this.actions.find(a => a.id === actionId);
        if (!action) {
            return {
                success: false,
                message: "操作不存在"
            };
        }
        
        // 检查操作要求
        if (action.requirements) {
            // 检查属性要求
            if (action.requirements.attributes) {
                for (const [attr, minValue] of Object.entries(action.requirements.attributes)) {
                    if (character.attributes[attr] < minValue) {
                        return {
                            success: false,
                            message: `你的${attr}不足，无法执行此操作`
                        };
                    }
                }
            }
            
            // 检查金钱要求
            if (action.requirements.money && character.money < action.requirements.money) {
                return {
                    success: false,
                    message: "你的金钱不足，无法执行此操作"
                };
            }
            
            // 检查时间要求
            if (action.requirements.time && character.timeAllocation.remaining < action.requirements.time) {
                return {
                    success: false,
                    message: "你的时间不足，无法执行此操作"
                };
            }
        }
        
        // 应用操作效果
        const results = [];
        
        if (action.effects) {
            for (const effect of action.effects) {
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
            message: action.resultText || `执行了 ${action.name}`,
            effects: results
        };
    }
}

class SceneManager {
    constructor() {
        this.scenes = {};
        this.currentScene = null;
        this.initializeScenes();
    }
    
    // 初始化场景库
    initializeScenes() {
        // 义务教育阶段场景
        this.registerScene(new Scene(
            'elementary_school',
            '小学',
            '你正在小学读书，这是基础教育的开始。',
            '义务教育',
            [
                {
                    id: 'study_hard',
                    name: '努力学习',
                    description: '花时间认真学习功课',
                    requirements: { time: 10 },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 3 },
                        { type: 'skill', target: 'academicBasics', value: 10 },
                        { type: 'attribute', target: 'happiness', value: -2 },
                        { type: 'time', value: 10 }
                    ],
                    resultText: '你花时间认真学习，知识水平有所提高。'
                },
                {
                    id: 'play_with_friends',
                    name: '和朋友玩耍',
                    description: '和同学们一起游戏',
                    requirements: { time: 5 },
                    effects: [
                        { type: 'attribute', target: 'happiness', value: 5 },
                        { type: 'attribute', target: 'charm', value: 2 },
                        { type: 'time', value: 5 }
                    ],
                    resultText: '你和朋友们玩得很开心，心情愉悦。'
                },
                {
                    id: 'sports_activity',
                    name: '参加体育活动',
                    description: '参加学校的体育课或活动',
                    requirements: { time: 5 },
                    effects: [
                        { type: 'attribute', target: 'fitness', value: 3 },
                        { type: 'skill', target: 'physicalTraining', value: 8 },
                        { type: 'attribute', target: 'health', value: 5 },
                        { type: 'time', value: 5 }
                    ],
                    resultText: '你积极参加体育活动，身体素质得到锻炼。'
                }
            ],
            { minAge: 6, maxAge: 12 }
        ));
        
        this.registerScene(new Scene(
            'middle_school',
            '初中',
            '你正在初中读书，学习内容开始变得更加复杂。',
            '义务教育',
            [
                {
                    id: 'study_hard',
                    name: '努力学习',
                    description: '花时间认真学习功课',
                    requirements: { time: 15 },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 4 },
                        { type: 'skill', target: 'academicBasics', value: 15 },
                        { type: 'attribute', target: 'happiness', value: -3 },
                        { type: 'time', value: 15 }
                    ],
                    resultText: '你花时间认真学习，知识水平有所提高。'
                },
                {
                    id: 'join_club',
                    name: '参加兴趣小组',
                    description: '参加学校的兴趣小组活动',
                    requirements: { time: 10 },
                    effects: [
                        { type: 'attribute', target: 'happiness', value: 5 },
                        { type: 'attribute', target: 'charm', value: 3 },
                        { type: 'skill', target: 'socialSkills', value: 10 },
                        { type: 'time', value: 10 }
                    ],
                    resultText: '你参加了兴趣小组，结交了新朋友，学到了新技能。'
                },
                {
                    id: 'sports_activity',
                    name: '参加体育活动',
                    description: '参加学校的体育课或活动',
                    requirements: { time: 8 },
                    effects: [
                        { type: 'attribute', target: 'fitness', value: 4 },
                        { type: 'skill', target: 'physicalTraining', value: 12 },
                        { type: 'attribute', target: 'health', value: 6 },
                        { type: 'time', value: 8 }
                    ],
                    resultText: '你积极参加体育活动，身体素质得到锻炼。'
                }
            ],
            { minAge: 12, maxAge: 15 }
        ));
        
        this.registerScene(new Scene(
            'high_school',
            '高中',
            '你正在高中读书，面临着高考的压力。',
            '义务教育',
            [
                {
                    id: 'study_hard',
                    name: '刻苦学习',
                    description: '为高考做准备，刻苦学习',
                    requirements: { time: 20 },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 5 },
                        { type: 'skill', target: 'academicBasics', value: 20 },
                        { type: 'attribute', target: 'happiness', value: -5 },
                        { type: 'attribute', target: 'health', value: -3 },
                        { type: 'time', value: 20 }
                    ],
                    resultText: '你刻苦学习，学术能力显著提高，但感到有些疲惫。'
                },
                {
                    id: 'balanced_study',
                    name: '平衡学习',
                    description: '保持学习与休息的平衡',
                    requirements: { time: 15 },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 3 },
                        { type: 'skill', target: 'academicBasics', value: 12 },
                        { type: 'attribute', target: 'happiness', value: 2 },
                        { type: 'time', value: 15 }
                    ],
                    resultText: '你保持学习与休息的平衡，既提高了学习成绩，又保持了良好的心态。'
                },
                {
                    id: 'part_time_job',
                    name: '课余兼职',
                    description: '利用课余时间做兼职赚钱',
                    requirements: { time: 10, attributes: { charm: 30 } },
                    effects: [
                        { type: 'money', value: 500 },
                        { type: 'attribute', target: 'happiness', value: -2 },
                        { type: 'skill', target: 'socialSkills', value: 8 },
                        { type: 'time', value: 10 }
                    ],
                    resultText: '你利用课余时间做兼职，赚取了一些零花钱，也积累了一些社会经验。'
                }
            ],
            { minAge: 15, maxAge: 18 }
        ));
        
        // 大学阶段场景
        this.registerScene(new Scene(
            'university',
            '大学',
            '你正在大学学习，拥有更多自由和选择。',
            '大学',
            [
                {
                    id: 'attend_class',
                    name: '认真上课',
                    description: '认真听讲，完成作业',
                    requirements: { time: 15 },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 4 },
                        { type: 'skill', target: 'academicBasics', value: 15 },
                        { type: 'time', value: 15 }
                    ],
                    resultText: '你认真上课，学术能力有所提高。'
                },
                {
                    id: 'self_study',
                    name: '自主学习',
                    description: '在图书馆或宿舍自主学习',
                    requirements: { time: 10 },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 3 },
                        { type: 'skill', target: 'academicBasics', value: 12 },
                        { type: 'time', value: 10 }
                    ],
                    resultText: '你进行自主学习，掌握了更多知识。'
                },
                {
                    id: 'part_time_job',
                    name: '校内兼职',
                    description: '在校内找一份兼职工作',
                    requirements: { time: 15 },
                    effects: [
                        { type: 'money', value: 1000 },
                        { type: 'skill', target: 'professionalSkills', value: 10 },
                        { type: 'attribute', target: 'happiness', value: -3 },
                        { type: 'time', value: 15 }
                    ],
                    resultText: '你在校内兼职，赚取了一些生活费，也积累了一些工作经验。'
                },
                {
                    id: 'campus_activity',
                    name: '参加校园活动',
                    description: '参加各种校园文化活动',
                    requirements: { time: 8 },
                    effects: [
                        { type: 'attribute', target: 'charm', value: 5 },
                        { type: 'attribute', target: 'happiness', value: 8 },
                        { type: 'skill', target: 'socialSkills', value: 15 },
                        { type: 'time', value: 8 }
                    ],
                    resultText: '你积极参加校园活动，结交了许多朋友，社交能力得到提升。'
                },
                {
                    id: 'exercise',
                    name: '体育锻炼',
                    description: '去操场或健身房锻炼身体',
                    requirements: { time: 5 },
                    effects: [
                        { type: 'attribute', target: 'fitness', value: 6 },
                        { type: 'attribute', target: 'health', value: 8 },
                        { type: 'skill', target: 'physicalTraining', value: 15 },
                        { type: 'time', value: 5 }
                    ],
                    resultText: '你坚持体育锻炼，身体素质明显提高。'
                }
            ],
            { minAge: 18, maxAge: 22 }
        ));
        
        // 硕博阶段场景
        this.registerScene(new Scene(
            'graduate_school',
            '研究生院',
            '你正在攻读研究生学位，专注于学术研究。',
            '硕博',
            [
                {
                    id: 'research',
                    name: '进行研究',
                    description: '专注于你的研究项目',
                    requirements: { time: 25 },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 6 },
                        { type: 'skill', target: 'academicBasics', value: 25 },
                        { type: 'attribute', target: 'happiness', value: -4 },
                        { type: 'time', value: 25 }
                    ],
                    resultText: '你专注于研究工作，学术能力显著提高。'
                },
                {
                    id: 'teaching_assistant',
                    name: '担任助教',
                    description: '为本科生课程担任助教',
                    requirements: { time: 15 },
                    effects: [
                        { type: 'money', value: 2000 },
                        { type: 'attribute', target: 'charm', value: 3 },
                        { type: 'skill', target: 'professionalSkills', value: 15 },
                        { type: 'time', value: 15 }
                    ],
                    resultText: '你担任助教工作，获得了一些收入，也锻炼了表达和组织能力。'
                },
                {
                    id: 'academic_conference',
                    name: '参加学术会议',
                    description: '参加学术会议，分享研究成果',
                    requirements: { time: 10, attributes: { intelligence: 70 } },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 5 },
                        { type: 'skill', target: 'academicBasics', value: 20 },
                        { type: 'attribute', target: 'charm', value: 4 },
                        { type: 'special', target: 'academicReputation', value: true },
                        { type: 'time', value: 10 }
                    ],
                    resultText: '你参加了学术会议，分享了研究成果，获得了同行的认可。'
                }
            ],
            { minAge: 22, maxAge: 28, special: { applyMaster: true } }
        ));
        
        // 社会阶段场景
        this.registerScene(new Scene(
            'workplace',
            '工作场所',
            '你正在工作单位努力工作，追求事业发展。',
            '社会',
            [
                {
                    id: 'work_hard',
                    name: '努力工作',
                    description: '专注于工作任务，提高工作效率',
                    requirements: { time: 30 },
                    effects: [
                        { type: 'money', value: 5000 },
                        { type: 'skill', target: 'professionalSkills', value: 20 },
                        { type: 'attribute', target: 'happiness', value: -5 },
                        { type: 'time', value: 30 }
                    ],
                    resultText: '你努力工作，完成了工作任务，获得了收入。'
                },
                {
                    id: 'networking',
                    name: '职场社交',
                    description: '与同事和上级建立良好关系',
                    requirements: { time: 10 },
                    effects: [
                        { type: 'attribute', target: 'charm', value: 5 },
                        { type: 'skill', target: 'socialSkills', value: 15 },
                        { type: 'special', target: 'careerOpportunity', value: true },
                        { type: 'time', value: 10 }
                    ],
                    resultText: '你积极参与职场社交，建立了良好的人际关系，可能带来职业发展机会。'
                },
                {
                    id: 'skill_training',
                    name: '技能培训',
                    description: '参加职业技能培训',
                    requirements: { time: 15, money: 2000 },
                    effects: [
                        { type: 'skill', target: 'professionalSkills', value: 30 },
                        { type: 'attribute', target: 'intelligence', value: 4 },
                        { type: 'money', value: -2000 },
                        { type: 'time', value: 15 }
                    ],
                    resultText: '你参加了技能培训，专业能力得到提升。'
                },
                {
                    id: 'investment',
                    name: '理财投资',
                    description: '学习理财知识，进行投资',
                    requirements: { time: 10, money: 5000 },
                    effects: [
                        { type: 'skill', target: 'financialSkills', value: 25 },
                        { type: 'money', value: -5000 },
                        { type: 'special', target: 'investment', value: true },
                        { type: 'time', value: 10 }
                    ],
                    resultText: '你进行了理财投资，学习了投资知识，资金开始增值。'
                }
            ],
            { minAge: 22 }
        ));
        
        this.registerScene(new Scene(
            'entrepreneur',
            '创业公司',
            '你正在经营自己的创业公司，面临挑战与机遇。',
            '社会',
            [
                {
                    id: 'business_development',
                    name: '业务拓展',
                    description: '专注于拓展业务和客户',
                    requirements: { time: 35 },
                    effects: [
                        { type: 'money', value: 10000 },
                        { type: 'skill', target: 'professionalSkills', value: 25 },
                        { type: 'attribute', target: 'happiness', value: -8 },
                        { type: 'attribute', target: 'health', value: -5 },
                        { type: 'time', value: 35 }
                    ],
                    resultText: '你努力拓展业务，公司收入有所增长，但工作压力很大。'
                },
                {
                    id: 'team_building',
                    name: '团队建设',
                    description: '招聘和培训团队成员',
                    requirements: { time: 20, money: 5000 },
                    effects: [
                        { type: 'money', value: -5000 },
                        { type: 'skill', target: 'socialSkills', value: 20 },
                        { type: 'special', target: 'teamEfficiency', value: true },
                        { type: 'time', value: 20 }
                    ],
                    resultText: '你投入时间和资金进行团队建设，团队效率得到提升。'
                },
                {
                    id: 'product_innovation',
                    name: '产品创新',
                    description: '开发新产品或服务',
                    requirements: { time: 25, attributes: { intelligence: 60 } },
                    effects: [
                        { type: 'skill', target: 'professionalSkills', value: 30 },
                        { type: 'attribute', target: 'intelligence', value: 5 },
                        { type: 'special', target: 'productInnovation', value: true },
                        { type: 'time', value: 25 }
                    ],
                    resultText: '你专注于产品创新，开发出了新的产品或服务，为公司带来了新的发展机会。'
                }
            ],
            { minAge: 22, special: { startBusiness: true } }
        ));

// 家庭场景
        this.registerScene(new Scene(
            'home',
            '家',
            '这是你的住所，可以在这里休息、学习或进行家务活动。',
            'all',
            [
                {
                    id: 'rest',
                    name: '休息',
                    description: '在家中好好休息恢复精力',
                    requirements: { time: 8 },
                    effects: [
                        { type: 'attribute', target: 'health', value: 10 },
                        { type: 'attribute', target: 'happiness', value: 5 },
                        { type: 'time', value: 8 }
                    ],
                    resultText: '你在家好好休息了一下，恢复了精力。'
                },
                {
                    id: 'home_study',
                    name: '在家学习',
                    description: '利用家中安静的环境专心学习',
                    requirements: { time: 5 },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 2 },
                        { type: 'skill', target: 'academicBasics', value: 8 },
                        { type: 'time', value: 5 }
                    ],
                    resultText: '你在家中安静地学习，提高了自己的学术能力。'
                },
                {
                    id: 'housework',
                    name: '做家务',
                    description: '打扫卫生，整理房间',
                    requirements: { time: 3 },
                    effects: [
                        { type: 'attribute', target: 'health', value: 2 },
                        { type: 'attribute', target: 'happiness', value: 3 },
                        { type: 'time', value: 3 }
                    ],
                    resultText: '你认真做了家务，家里变得干净整洁，心情也变好了。'
                },
                {
                    id: 'cook_meal',
                    name: '自己做饭',
                    description: '自己下厨准备一顿美食',
                    requirements: { time: 4, money: 50 },
                    effects: [
                        { type: 'attribute', target: 'health', value: 5 },
                        { type: 'attribute', target: 'happiness', value: 4 },
                        { type: 'skill', target: 'cooking', value: 10 },
                        { type: 'money', value: -50 },
                        { type: 'time', value: 4 }
                    ],
                    resultText: '你亲自下厨做了一顿美味的饭菜，既省钱又健康，烹饪技能也有所提升。'
                },
                {
                    id: 'online_shopping',
                    name: '网上购物',
                    description: '在网上购买日常用品或自己喜欢的东西',
                    requirements: { time: 2, money: 200 },
                    effects: [
                        { type: 'attribute', target: 'happiness', value: 8 },
                        { type: 'money', value: -200 },
                        { type: 'time', value: 2 }
                    ],
                    resultText: '你在网上购买了一些东西，花了一些钱，但心情愉悦。'
                }
            ],
            { minAge: 15, maxAge: 80 }
        ));

// 便利店场景
        this.registerScene(new Scene(
            'convenience_store',
            '便利店',
            '24小时营业的便利店，可以购买日常用品和食物。',
            'all',
            [
                {
                    id: 'buy_snacks',
                    name: '购买零食',
                    description: '买一些零食解馋',
                    requirements: { time: 1, money: 30 },
                    effects: [
                        { type: 'attribute', target: 'happiness', value: 3 },
                        { type: 'attribute', target: 'health', value: -1 },
                        { type: 'money', value: -30 },
                        { type: 'time', value: 1 }
                    ],
                    resultText: '你买了一些零食，享受美味的同时心情变好了。'
                },
                {
                    id: 'buy_necessities',
                    name: '购买日用品',
                    description: '购买日常生活必需品',
                    requirements: { time: 2, money: 100 },
                    effects: [
                        { type: 'attribute', target: 'happiness', value: 1 },
                        { type: 'money', value: -100 },
                        { type: 'time', value: 2 }
                    ],
                    resultText: '你购买了一些生活必需品，为日常生活做好了准备。'
                },
                {
                    id: 'part_time_convenience',
                    name: '便利店兼职',
                    description: '在便利店做兼职工作',
                    requirements: { time: 6 },
                    effects: [
                        { type: 'money', value: 300 },
                        { type: 'attribute', target: 'happiness', value: -2 },
                        { type: 'skill', target: 'socialSkills', value: 5 },
                        { type: 'time', value: 6 }
                    ],
                    resultText: '你在便利店兼职了几个小时，赚取了一些收入，也锻炼了与人交流的能力。'
                },
                {
                    id: 'lottery',
                    name: '买彩票',
                    description: '试试运气，购买彩票',
                    requirements: { time: 1, money: 20 },
                    effects: [
                        { type: 'money', value: -20 },
                        { type: 'attribute', target: 'happiness', value: 2 },
                        { type: 'time', value: 1 },
                        {
                            type: 'randomEvent',
                            chance: 0.01,
                            successEffects: [
                                { type: 'money', value: 1000 },
                                { type: 'attribute', target: 'happiness', value: 20 }
                            ],
                            successText: '恭喜你中奖了！获得了1000元奖金！',
                            failureText: '很遗憾，这次没有中奖。'
                        }
                    ],
                    resultText: '你买了一张彩票，期待着中奖的可能。'
                }
            ],
            { minAge: 3, maxAge: 80 }
        ));

// 餐厅场景
        this.registerScene(new Scene(
            'restaurant',
            '餐厅',
            '提供各种美食的餐厅，可以用餐或工作。',
            'all',
            [
                {
                    id: 'eat_meal',
                    name: '用餐',
                    description: '在餐厅享用一顿美食',
                    requirements: { time: 2, money: 80 },
                    effects: [
                        { type: 'attribute', target: 'happiness', value: 5 },
                        { type: 'attribute', target: 'health', value: 3 },
                        { type: 'money', value: -80 },
                        { type: 'time', value: 2 }
                    ],
                    resultText: '你在餐厅享用了一顿美食，感到满足和愉悦。'
                },
                {
                    id: 'luxury_dinner',
                    name: '高级晚餐',
                    description: '在高档餐厅享用豪华晚餐',
                    requirements: { time: 3, money: 300 },
                    effects: [
                        { type: 'attribute', target: 'happiness', value: 10 },
                        { type: 'attribute', target: 'health', value: 5 },
                        { type: 'attribute', target: 'charm', value: 3 },
                        { type: 'money', value: -300 },
                        { type: 'time', value: 3 }
                    ],
                    resultText: '你在高档餐厅享用了一顿豪华晚餐，不仅味蕾得到满足，还提升了自己的品味。'
                },
                {
                    id: 'business_meal',
                    name: '商务聚餐',
                    description: '与同事或合作伙伴进行商务聚餐',
                    requirements: { time: 4, money: 200, attributes: { charm: 40 } },
                    effects: [
                        { type: 'attribute', target: 'charm', value: 5 },
                        { type: 'skill', target: 'businessNegotiation', value: 15 },
                        { type: 'money', value: -200 },
                        { type: 'time', value: 4 }
                    ],
                    resultText: '你参加了商务聚餐，不仅享用了美食，还拓展了人脉，提升了商务谈判能力。'
                },
                {
                    id: 'work_restaurant',
                    name: '餐厅工作',
                    description: '在餐厅做服务员或厨师助手',
                    requirements: { time: 8 },
                    effects: [
                        { type: 'money', value: 400 },
                        { type: 'attribute', target: 'happiness', value: -3 },
                        { type: 'attribute', target: 'fitness', value: 2 },
                        { type: 'skill', target: 'cooking', value: 8 },
                        { type: 'skill', target: 'socialSkills', value: 10 },
                        { type: 'time', value: 8 }
                    ],
                    resultText: '你在餐厅工作了一天，虽然有些疲惫，但赚取了收入，并提升了烹饪和社交能力。'
                }
            ],
            { minAge: 8, maxAge: 80 }
        ));

// 酒吧场景
        this.registerScene(new Scene(
            'bar',
            '酒吧',
            '灯光昏暗的酒吧，可以喝酒、社交或放松。',
            'all',
            [
                {
                    id: 'drink_alcohol',
                    name: '小酌几杯',
                    description: '在酒吧喝几杯酒放松心情',
                    requirements: { time: 3, money: 120, minAge: 18 },
                    effects: [
                        { type: 'attribute', target: 'happiness', value: 8 },
                        { type: 'attribute', target: 'health', value: -3 },
                        { type: 'money', value: -120 },
                        { type: 'time', value: 3 }
                    ],
                    resultText: '你在酒吧喝了几杯酒，感到放松和愉悦，但也有些微醺。'
                },
                {
                    id: 'social_networking',
                    name: '社交聚会',
                    description: '在酒吧与朋友或新认识的人社交',
                    requirements: { time: 4, money: 150, minAge: 18, attributes: { charm: 35 } },
                    effects: [
                        { type: 'attribute', target: 'charm', value: 6 },
                        { type: 'skill', target: 'socialSkills', value: 15 },
                        { type: 'attribute', target: 'happiness', value: 7 },
                        { type: 'money', value: -150 },
                        { type: 'time', value: 4 }
                    ],
                    resultText: '你在酒吧参加了社交聚会，结交了新朋友，社交能力和魅力都有所提升。'
                },
                {
                    id: 'perform_bar',
                    name: '酒吧表演',
                    description: '在酒吧进行音乐或其他才艺表演',
                    requirements: { time: 5, attributes: { charm: 50 }, skills: { musicPerformance: 30 } },
                    effects: [
                        { type: 'money', value: 300 },
                        { type: 'attribute', target: 'charm', value: 8 },
                        { type: 'skill', target: 'musicPerformance', value: 20 },
                        { type: 'attribute', target: 'happiness', value: 12 },
                        { type: 'time', value: 5 }
                    ],
                    resultText: '你在酒吧进行了精彩的表演，赢得了观众的喝彩，既赚取了收入，又提升了表演技能。'
                },
                {
                    id: 'work_bartender',
                    name: '调酒师工作',
                    description: '在酒吧担任调酒师',
                    requirements: { time: 8, minAge: 18, skills: { bartending: 20 } },
                    effects: [
                        { type: 'money', value: 500 },
                        { type: 'skill', target: 'bartending', value: 15 },
                        { type: 'skill', target: 'socialSkills', value: 10 },
                        { type: 'attribute', target: 'charm', value: 4 },
                        { type: 'attribute', target: 'happiness', value: -2 },
                        { type: 'time', value: 8 }
                    ],
                    resultText: '你在酒吧担任调酒师，调制了各种鸡尾酒，赚取了不少小费，也提升了调酒技能。'
                }
            ],
            { minAge: 18, maxAge: 80 }
        ));

// 图书馆场景
        this.registerScene(new Scene(
            'library',
            '图书馆',
            '安静的图书馆，可以阅读、学习或研究。',
            'all',
            [
                {
                    id: 'read_books',
                    name: '阅读书籍',
                    description: '在图书馆阅读各类书籍',
                    requirements: { time: 4 },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 4 },
                        { type: 'skill', target: 'academicBasics', value: 10 },
                        { type: 'attribute', target: 'happiness', value: 3 },
                        { type: 'time', value: 4 }
                    ],
                    resultText: '你在图书馆读了几本好书，学到了新知识，也放松了心情。'
                },
                {
                    id: 'study_library',
                    name: '专心学习',
                    description: '在图书馆安静的环境中专心学习',
                    requirements: { time: 6 },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 6 },
                        { type: 'skill', target: 'academicBasics', value: 18 },
                        { type: 'attribute', target: 'happiness', value: -1 },
                        { type: 'time', value: 6 }
                    ],
                    resultText: '你在图书馆专心学习了几个小时，学术能力有显著提高，但感到有些疲惫。'
                },
                {
                    id: 'research',
                    name: '进行研究',
                    description: '查阅资料进行特定课题的研究',
                    requirements: { time: 8, attributes: { intelligence: 60 } },
                    effects: [
                        { type: 'attribute', target: 'intelligence', value: 8 },
                        { type: 'skill', target: 'research', value: 25 },
                        { type: 'attribute', target: 'happiness', value: 5 },
                        { type: 'time', value: 8 }
                    ],
                    resultText: '你在图书馆进行了深入研究，取得了一些成果，研究能力显著提高。'
                },
                {
                    id: 'work_library',
                    name: '图书馆工作',
                    description: '在图书馆担任管理员或助理',
                    requirements: { time: 5 },
                    effects: [
                        { type: 'money', value: 250 },
                        { type: 'attribute', target: 'intelligence', value: 2 },
                        { type: 'skill', target: 'organization', value: 12 },
                        { type: 'time', value: 5 }
                    ],
                    resultText: '你在图书馆工作，整理书籍和帮助读者，赚取了一些收入，也提升了组织能力。'
                }
            ],
            { minAge: 5, maxAge: 80 }
        ));

// 公园场景
        this.registerScene(new Scene(
            'park',
            '公园',
            '绿树成荫的公园，可以锻炼、放松或约会。',
            'all',
            [
                {
                    id: 'exercise_park',
                    name: '户外锻炼',
                    description: '在公园进行跑步、健身等锻炼',
                    requirements: { time: 3 },
                    effects: [
                        { type: 'attribute', target: 'fitness', value: 8 },
                        { type: 'attribute', target: 'health', value: 7 },
                        { type: 'skill', target: 'physicalTraining', value: 15 },
                        { type: 'time', value: 3 }
                    ],
                    resultText: '你在公园进行了户外锻炼，身体素质和健康状况都有所提高。'
                },
                {
                    id: 'relaxation',
                    name: '休闲放松',
                    description: '在公园散步或坐在湖边放松',
                    requirements: { time: 2 },
                    effects: [
                        { type: 'attribute', target: 'happiness', value: 6 },
                        { type: 'attribute', target: 'health', value: 3 },
                        { type: 'attribute', target: 'stress', value: -8 },
                        { type: 'time', value: 2 }
                    ],
                    resultText: '你在公园休闲放松，呼吸新鲜空气，心情变得愉悦，压力也减轻了。'
                },
                {
                    id: 'dating',
                    name: '公园约会',
                    description: '在公园与喜欢的人约会',
                    requirements: { time: 4, money: 100, relationship: true },
                    effects: [
                        { type: 'attribute', target: 'happiness', value: 12 },
                        { type: 'attribute', target: 'charm', value: 5 },
                        { type: 'relationship', target: 'intimacy', value: 15 },
                        { type: 'money', value: -100 },
                        { type: 'time', value: 4 }
                    ],
                    resultText: '你在公园与心仪的人进行了一次浪漫约会，关系更加亲密了。'
                },
                {
                    id: 'photography',
                    name: '公园摄影',
                    description: '在公园拍摄自然风景或人像',
                    requirements: { time: 3, skills: { photography: 20 } },
                    effects: [
                        { type: 'skill', target: 'photography', value: 12 },
                        { type: 'attribute', target: 'happiness', value: 6 },
                        { type: 'attribute', target: 'creativity', value: 8 },
                        { type: 'time', value: 3 }
                    ],
                    resultText: '你在公园拍摄了一些精美的照片，提升了摄影技能，也激发了创造力。'
                }
            ],
            { minAge: 1, maxAge: 80 }
        ));

// 购物中心场景
        this.registerScene(new Scene(
            'shopping_mall',
            '购物中心',
            '大型购物中心，有各种商店、餐厅和娱乐设施。',
            'all',
            [
                {
                    id: 'shopping',
                    name: '购物',
                    description: '在购物中心购买服装、电子产品等',
                    requirements: { time: 3, money: 500 },
                    effects: [
                        { type: 'attribute', target: 'happiness', value: 8 },
                        { type: 'attribute', target: 'charm', value: 3 },
                        { type: 'money', value: -500 },
                        { type: 'time', value: 3 }
                    ],
                    resultText: '你在购物中心买了一些心仪的物品，心情愉悦，也提升了自己的形象。'
                },
                {
                    id: 'window_shopping',
                    name: '逛街',
                    description: '在购物中心闲逛，不一定购买',
                    requirements: { time: 2 },
                    effects: [
                        { type: 'attribute', target: 'happiness', value: 4 },
                        { type: 'attribute', target: 'stress', value: -5 },
                        { type: 'time', value: 2 }
                    ],
                    resultText: '你在购物中心悠闲地逛了一圈，放松了心情，减轻了压力。'
                },
                {
                    id: 'cinema',
                    name: '看电影',
                    description: '在购物中心的电影院观看电影',
                    requirements: { time: 3, money: 80 },
                    effects: [
                        { type: 'attribute', target: 'happiness', value: 7 },
                        { type: 'attribute', target: 'creativity', value: 3 },
                        { type: 'money', value: -80 },
                        { type: 'time', value: 3 }
                    ],
                    resultText: '你在电影院观看了一部精彩的电影，既放松了心情，也得到了一些启发。'
                },
                {
                    id: 'work_retail',
                    name: '零售工作',
                    description: '在购物中心的商店担任销售员',
                    requirements: { time: 8, attributes: { charm: 35 } },
                    effects: [
                        { type: 'money', value: 450 },
                        { type: 'skill', target: 'salesmanship', value: 15 },
                        { type: 'skill', target: 'socialSkills', value: 10 },
                        { type: 'attribute', target: 'happiness', value: -2 },
                        { type: 'time', value: 8 }
                    ],
                    resultText: '你在购物中心的商店工作了一天，赚取了收入，销售和社交能力也有所提升。'
                }
            ],
            { minAge: 16, maxAge: 80 }
        ));

// 健身房场景
        this.registerScene(new Scene(
            'gym',
            '健身房',
            '设备齐全的健身房，可以进行各种健身活动。',
            'all',
            [
                {
                    id: 'workout',
                    name: '进行健身',
                    description: '使用健身器材进行锻炼',
                    requirements: { time: 2, money: 50 },
                    effects: [
                        { type: 'attribute', target: 'fitness', value: 10 },
                        { type: 'attribute', target: 'health', value: 8 },
                        { type: 'skill', target: 'physicalTraining', value: 18 },
                        { type: 'money', value: -50 },
                        { type: 'time', value: 2 }
                    ],
                    resultText: '你在健身房进行了高强度训练，身体素质显著提高。'
                },
                {
                    id: 'yoga',
                    name: '瑜伽课程',
                    description: '参加健身房的瑜伽课程',
                    requirements: { time: 2, money: 80 },
                    effects: [
                        { type: 'attribute', target: 'fitness', value: 5 },
                        { type: 'attribute', target: 'health', value: 7 },
                        { type: 'attribute', target: 'stress', value: -10 },
                        { type: 'skill', target: 'yoga', value: 15 },
                        { type: 'money', value: -80 },
                        { type: 'time', value: 2 }
                    ],
                    resultText: '你参加了瑜伽课程，身体变得更加柔韧，心灵也得到了放松。'
                },
                {
                    id: 'personal_trainer',
                    name: '私人教练',
                    description: '请私人教练指导健身',
                    requirements: { time: 3, money: 300 },
                    effects: [
                        { type: 'attribute', target: 'fitness', value: 15 },
                        { type: 'attribute', target: 'health', value: 12 },
                        { type: 'skill', target: 'physicalTraining', value: 25 },
                        { type: 'money', value: -300 },
                        { type: 'time', value: 3 }
                    ],
                    resultText: '在私人教练的专业指导下，你的健身效果显著提高，学到了正确的锻炼方法。'
                },
                {
                    id: 'work_trainer',
                    name: '健身教练工作',
                    description: '在健身房担任健身教练',
                    requirements: { time: 6, attributes: { fitness: 80 }, skills: { physicalTraining: 60 } },
                    effects: [
                        { type: 'money', value: 600 },
                        { type: 'skill', target: 'coaching', value: 20 },
                        { type: 'attribute', target: 'fitness', value: 5 },
                        { type: 'time', value: 6 }
                    ],
                    resultText: '你在健身房担任教练，指导会员正确健身，赚取了丰厚的收入，也提升了教练技能。'
                }
            ],
            { minAge: 10, maxAge: 70 }
        ));

// 医院场景
        this.registerScene(new Scene(
            'hospital',
            '医院',
            '提供医疗服务的场所，可以就医或工作。',
            'all',
            [
                {
                    id: 'medical_checkup',
                    name: '体检',
                    description: '进行全面体检',
                    requirements: { time: 4, money: 300 },
                    effects: [
                        { type: 'attribute', target: 'health', value: 10 },
                        { type: 'attribute', target: 'intelligence', value: 2 },
                        { type: 'money', value: -300 },
                        { type: 'time', value: 4 }
                    ],
                    resultText: '你进行了全面体检，及时了解了自己的健康状况，也学到了一些健康知识。'
                },
                {
                    id: 'treatment',
                    name: '接受治疗',
                    description: '生病时前往医院接受治疗',
                    requirements: { time: 5, money: 500 },
                    effects: [
                        { type: 'attribute', target: 'health', value: 30 },
                        { type: 'attribute', target: 'happiness', value: 15 },
                        { type: 'money', value: -500 },
                        { type: 'time', value: 5 }
                    ],
                    resultText: '你在医院接受了治疗，健康状况大为改善，心情也变好了。'
                },
                {
                    id: 'volunteer',
                    name: '医院志愿者',
                    description: '在医院担任志愿者，帮助病人',
                    requirements: { time: 4, attributes: { charm: 40 } },
                    effects: [
                        { type: 'attribute', target: 'happiness', value: 10 },
                        { type: 'skill', target: 'socialSkills', value: 12 },
                        { type: 'skill', target: 'medicine', value: 8 },
                        { type: 'time', value: 4 }
                    ],
                    resultText: '你在医院担任志愿者，帮助病人，不仅感到充实，也学到了一些医疗知识。'
                },
                {
                    id: 'work_medical',
                    name: '医护工作',
                    description: '在医院担任医生或护士',
                    requirements: { time: 10, attributes: { intelligence: 70 }, skills: { medicine: 80 } },
                    effects: [
                        { type: 'money', value: 1000 },
                        { type: 'skill', target: 'medicine', value: 20 },
                        { type: 'attribute', target: 'happiness', value: 5 },
                        { type: 'attribute', target: 'stress', value: 8 },
                        { type: 'time', value: 10 }
                    ],
                    resultText: '你在医院工作了一天，治疗了许多病人，赚取了丰厚的收入，医学技能也有所提高，但也感到一些压力。'
                }
            ],
            { minAge: 12, maxAge: 80 }
        ));
    }

    // 注册场景到场景库
    registerScene(scene) {
        this.scenes[scene.id] = scene;
    }
    
    // 获取当前可用场景列表
    getAvailableScenes(character) {
        const availableScenes = [];

        for (const sceneId in this.scenes) {
            if (Object.prototype.hasOwnProperty.call(this.scenes, sceneId)) {
                const scene = this.scenes[sceneId];
                if (scene.isAvailable(character)) {
                    availableScenes.push(scene);
                }
            }
        }

        return availableScenes;
    }
    // 设置当前场景
    setCurrentScene(sceneId) {
        if (this.scenes[sceneId]) {
            this.currentScene = this.scenes[sceneId];
            return true;
        }
        return false;
    }
    
    // 获取当前场景
    getCurrentScene() {
        return this.currentScene;
    }
    
    // 渲染场景选择界面
    renderSceneSelection(character) {
        const container = document.getElementById('scene-container');
        const description = document.getElementById('scene-description');
        const options = document.getElementById('scene-options');
        
        // 清空内容
        description.textContent = '选择你想要前往的场景：';
        options.innerHTML = '';
        
        // 获取可用场景
        const availableScenes = this.getAvailableScenes(character);
        
        if (availableScenes.length === 0) {
            options.innerHTML = '<div>当前没有可用的场景</div>';
            return;
        }
        
        // 创建场景选项
        for (const scene of availableScenes) {
            const sceneButton = document.createElement('button');
            sceneButton.className = 'action-button scene-option';
            sceneButton.textContent = scene.name;
            
            sceneButton.addEventListener('click', () => {
                this.setCurrentScene(scene.id);
                this.renderCurrentScene(character);
            });
            
            options.appendChild(sceneButton);
        }
    }
    
    // 渲染当前场景
    renderCurrentScene(character) {
        if (!this.currentScene) {
            this.renderSceneSelection(character);
            return;
        }
        
        const container = document.getElementById('scene-container');
        const description = document.getElementById('scene-description');
        const options = document.getElementById('scene-options');
        
        // 设置场景描述
        description.textContent = this.currentScene.description;
        options.innerHTML = '';
        
        // 创建返回按钮
        const backButton = document.createElement('button');
        backButton.className = 'action-button scene-option';
        backButton.textContent = '返回场景选择';
        backButton.addEventListener('click', () => {
            this.currentScene = null;
            this.renderSceneSelection(character);
        });
        options.appendChild(backButton);
        
        // 创建场景操作按钮
        for (const action of this.currentScene.actions) {
            const actionButton = document.createElement('button');
            actionButton.className = 'action-button scene-option';
            actionButton.textContent = action.name;
            
            // 检查操作要求
            let canPerform = true;
            let requirementText = '';
            
            if (action.requirements) {
                // 检查时间要求
                if (action.requirements.time && character.timeAllocation.remaining < action.requirements.time) {
                    canPerform = false;
                    requirementText = `需要${action.requirements.time}%的时间`;
                }
                
                // 检查金钱要求
                if (action.requirements.money && character.money < action.requirements.money) {
                    canPerform = false;
                    requirementText = `需要¥${action.requirements.money}`;
                }
                
                // 检查属性要求
                if (action.requirements.attributes) {
                    for (const [attr, minValue] of Object.entries(action.requirements.attributes)) {
                        if (character.attributes[attr] < minValue) {
                            canPerform = false;
                            requirementText = `需要${attr}达到${minValue}`;
                            break;
                        }
                    }
                }
            }
            
            if (!canPerform) {
                actionButton.disabled = true;
                actionButton.title = requirementText;
            } else {
                actionButton.addEventListener('click', () => {
                    const result = this.currentScene.performAction(action.id, character);
                    
                    if (result.success) {
                        Game.addEventLog(result.message);
                        if (result.effects) {
                            for (const effect of result.effects) {
                                Game.addEventLog(`效果: ${effect}`);
                            }
                        }
                        
                        // 更新场景显示（可能需要刷新按钮状态）
                        this.renderCurrentScene(character);
                    } else {
                        Game.addEventLog(result.message);
                    }
                });
            }
            
            // 添加操作描述
            const actionDescription = document.createElement('div');
            actionDescription.className = 'scene-action-description';
            actionDescription.textContent = action.description;
            
            const actionContainer = document.createElement('div');
            actionContainer.className = 'scene-action-container';
            actionContainer.appendChild(actionButton);
            actionContainer.appendChild(actionDescription);
            
            options.appendChild(actionContainer);
        }
    }
}

// 导出SceneManager类
if (typeof module !== 'undefined') {
    module.exports = { Scene, SceneManager };
}
