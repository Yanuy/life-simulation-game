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
        if (this.lifeStage && character.lifeStage !== this.lifeStage) {
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
            { minAge: 18, maxAge: 22, special: { collegeTier: ['normal', 'good', 'top'] } }
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
            { minAge: 22, special: { findJob: true } }
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
