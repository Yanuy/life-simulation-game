// 场景管理类
class SceneManager {
    constructor() {
        this.scenes = {
            "home": {
                id: "home",
                name: "家",
                description: "这是你的家，一个温馨的避风港。",
                options: [
                    {
                        text: "学习",
                        condition: (character) => character.age >= 6,
                        action: (character) => {
                            character.attributes.intelligence += 2;
                            character.attributes.happiness -= 1;
                            character.addSkillProgress("学术基础", 10);
                            game.addEventLog("你在家学习了一段时间，智力+2，幸福感-1，学术基础技能进度+10。");
                            game.updateUI();
                        }
                    },
                    {
                        text: "休息",
                        condition: (character) => true,
                        action: (character) => {
                            character.attributes.health += 10;
                            character.attributes.happiness += 5;
                            game.addEventLog("你在家好好休息了一下，体力+10，幸福感+5。");
                            game.updateUI();
                        }
                    },
                    {
                        text: "健身",
                        condition: (character) => character.age >= 8,
                        action: (character) => {
                            character.attributes.fitness += 3;
                            character.attributes.health -= 5;
                            character.addSkillProgress("体育锻炼", 15);
                            game.addEventLog("你在家锻炼了身体，体质+3，体力-5，体育锻炼技能进度+15。");
                            game.updateUI();
                        }
                    },
                    {
                        text: "拜访邻居",
                        condition: (character) => character.age >= 6,
                        action: (character) => {
                            game.npcManager.interactWithNPC("neighbor");
                        }
                    }
                ]
            },
            "school": {
                id: "school",
                name: "学校",
                description: "这是你的学校，知识的殿堂。",
                options: [
                    {
                        text: "上课",
                        condition: (character) => character.age >= 6 && character.age < 22,
                        action: (character) => {
                            character.attributes.intelligence += 3;
                            character.attributes.happiness -= 2;
                            character.attributes.health -= 5;
                            character.addSkillProgress("学术基础", 15);
                            game.addEventLog("你认真上课，智力+3，幸福感-2，体力-5，学术基础技能进度+15。");
                            game.updateUI();
                        }
                    },
                    {
                        text: "参加体育活动",
                        condition: (character) => character.age >= 6 && character.age < 22,
                        action: (character) => {
                            character.attributes.fitness += 4;
                            character.attributes.health -= 10;
                            character.attributes.happiness += 5;
                            character.addSkillProgress("体育锻炼", 20);
                            game.addEventLog("你参加了体育活动，体质+4，体力-10，幸福感+5，体育锻炼技能进度+20。");
                            game.updateUI();
                        }
                    },
                    {
                        text: "与同学交流",
                        condition: (character) => character.age >= 6 && character.age < 22,
                        action: (character) => {
                            character.attributes.charm += 3;
                            character.attributes.happiness += 3;
                            character.addSkillProgress("社交能力", 15);
                            game.addEventLog("你与同学进行了交流，魅力+3，幸福感+3，社交能力技能进度+15。");
                            game.updateUI();
                        }
                    },
                    {
                        text: "与老师交流",
                        condition: (character) => character.age >= 6 && character.age < 22,
                        action: (character) => {
                            game.npcManager.interactWithNPC("teacher");
                        }
                    }
                ]
            },
            "university": {
                id: "university",
                name: "大学",
                description: "这是你的大学校园，充满了自由和机会。",
                options: [
                    {
                        text: "上课",
                        condition: (character) => character.lifeStage === "university",
                        action: (character) => {
                            character.attributes.intelligence += 4;
                            character.attributes.health -= 5;
                            character.addSkillProgress("学术基础", 15);
                            character.addSkillProgress("专业技能", 10);
                            game.addEventLog("你认真上课，智力+4，体力-5，学术基础技能进度+15，专业技能进度+10。");
                            game.updateUI();
                        }
                    },
                    {
                        text: "参加学生活动",
                        condition: (character) => character.lifeStage === "university",
                        action: (character) => {
                            character.attributes.charm += 3;
                            character.attributes.happiness += 5;
                            character.attributes.health -= 5;
                            character.addSkillProgress("社交能力", 20);
                            game.addEventLog("你参加了学生活动，魅力+3，幸福感+5，体力-5，社交能力技能进度+20。");
                            game.updateUI();
                        }
                    },
                    {
                        text: "与同学交流",
                        condition: (character) => character.lifeStage === "university",
                        action: (character) => {
                            character.attributes.charm += 3;
                            character.attributes.happiness += 3;
                            character.addSkillProgress("社交能力", 15);
                            game.addEventLog("你与同学进行了交流，魅力+3，幸福感+3，社交能力技能进度+15。");
                            game.updateUI();
                        }
                    },
                    {
                        text: "与教授交流",
                        condition: (character) => character.lifeStage === "university",
                        action: (character) => {
                            game.npcManager.interactWithNPC("professor");
                        }
                    },
                    {
                        text: "学校图书馆学习",
                        condition: (character) => character.lifeStage === "university",
                        action: (character) => {
                            character.attributes.intelligence += 5;
                            character.attributes.happiness -= 3;
                            character.attributes.health -= 8;
                            character.addSkillProgress("学术基础", 25);
                            character.addSkillProgress("专业技能", 15);
                            game.addEventLog("你在图书馆认真学习，智力+5，幸福感-3，体力-8，学术基础技能进度+25，专业技能进度+15。");
                            game.updateUI();
                        }
                    }
                ]
            },
            "graduate_school": {
                id: "graduate_school",
                name: "研究生院",
                description: "这是研究生院，更高层次的学术殿堂。",
                options: [
                    {
                        text: "参加研究项目",
                        condition: (character) => character.lifeStage === "graduate",
                        action: (character) => {
                            character.attributes.intelligence += 6;
                            character.attributes.health -= 10;
                            character.attributes.happiness -= 2;
                            character.addSkillProgress("学术基础", 20);
                            character.addSkillProgress("专业技能", 25);
                            game.addEventLog("你参加了研究项目，智力+6，体力-10，幸福感-2，学术基础技能进度+20，专业技能进度+25。");
                            game.updateUI();
                        }
                    },
                    {
                        text: "与导师交流",
                        condition: (character) => character.lifeStage === "graduate",
                        action: (character) => {
                            game.npcManager.interactWithNPC("supervisor");
                        }
                    },
                    {
                        text: "撰写论文",
                        condition: (character) => character.lifeStage === "graduate",
                        action: (character) => {
                            character.attributes.intelligence += 5;
                            character.attributes.health -= 15;
                            character.attributes.happiness -= 5;
                            character.addSkillProgress("专业技能", 30);
                            game.addEventLog("你专注于论文写作，智力+5，体力-15，幸福感-5，专业技能进度+30。");
                            game.updateUI();
                        }
                    }
                ]
            },
            "phd_program": {
                id: "phd_program",
                name: "博士项目",
                description: "这是博士项目，学术研究的最高殿堂。",
                options: [
                    {
                        text: "进行深入研究",
                        condition: (character) => character.lifeStage === "phd",
                        action: (character) => {
                            character.attributes.intelligence += 8;
                            character.attributes.health -= 15;
                            character.attributes.happiness -= 5;
                            character.addSkillProgress("专业技能", 40);
                            game.addEventLog("你进行了深入研究，智力+8，体力-15，幸福感-5，专业技能进度+40。");
                            game.updateUI();
                        }
                    },
                    {
                        text: "撰写博士论文",
                        condition: (character) => character.lifeStage === "phd",
                        action: (character) => {
                            character.attributes.intelligence += 10;
                            character.attributes.health -= 20;
                            character.attributes.happiness -= 10;
                            character.addSkillProgress("专业技能", 50);
                            game.addEventLog("你专注于博士论文写作，智力+10，体力-20，幸福感-10，专业技能进度+50。");
                            game.updateUI();
                        }
                    },
                    {
                        text: "与导师讨论",
                        condition: (character) => character.lifeStage === "phd",
                        action: (character) => {
                            game.npcManager.interactWithNPC("supervisor");
                        }
                    }
                ]
            },
            "work": {
                id: "work",
                name: "工作场所",
                description: "这是你的工作场所，每天为生活奋斗的地方。",
                options: [
                    {
                        text: "努力工作",
                        condition: (character) => character.lifeStage === "society",
                        action: (character) => {
                            let salary = 1000;
                            // 专业技能影响薪资
                            if (character.skills["专业技能"]) {
                                salary += character.skills["专业技能"].level * 200;
                            }
                            // 学历影响薪资
                            if (character.age >= 22 && character.attributes.intelligence >= 85) {
                                salary += 2000; // 硕士
                            }
                            if (character.age >= 25 && character.attributes.intelligence >= 90) {
                                salary += 3000; // 博士
                            }

                            character.money += salary;
                            character.attributes.health -= 15;
                            character.attributes.happiness -= 3;
                            character.addSkillProgress("专业技能", 20);
                            game.addEventLog(`你努力工作，获得薪资¥${salary}，体力-15，幸福感-3，专业技能进度+20。`);
                            game.updateUI();
                        }
                    },
                    {
                        text: "与同事交流",
                        condition: (character) => character.lifeStage === "society",
                        action: (character) => {
                            character.attributes.charm += 4;
                            character.attributes.happiness += 3;
                            character.addSkillProgress("社交能力", 15);
                            game.addEventLog("你与同事进行了愉快的交流，魅力+4，幸福感+3，社交能力技能进度+15。");
                            game.updateUI();
                        }
                    },
                    {
                        text: "与上司交流",
                        condition: (character) => character.lifeStage === "society",
                        action: (character) => {
                            game.npcManager.interactWithNPC("boss");
                        }
                    },
                    {
                        text: "学习新技能",
                        condition: (character) => character.lifeStage === "society",
                        action: (character) => {
                            character.attributes.intelligence += 3;
                            character.attributes.health -= 5;
                            character.addSkillProgress("专业技能", 25);
                            game.addEventLog("你学习了新的工作技能，智力+3，体力-5，专业技能进度+25。");
                            game.updateUI();
                        }
                    },
                    {
                        text: "进行投资",
                        condition: (character) => character.lifeStage === "society" && !character.skills["理财能力"].locked,
                        action: (character) => {
                            // 解锁理财能力
                            if (character.skills["理财能力"].locked) {
                                character.skills["理财能力"].locked = false;
                                game.addEventLog("你开始了解投资，解锁了理财能力技能！");
                            }

                            // 基础投资回报
                            const financialSkill = character.skills["理财能力"].level;
                            const baseReturn = Math.random() * 0.2 - 0.05; // -5% 到 15% 的基础回报率
                            const skillBonus = financialSkill * 0.01; // 每级理财能力增加1%回报率
                            const returnRate = baseReturn + skillBonus;

                            const investAmount = 1000;
                            if (character.money >= investAmount) {
                                character.money -= investAmount;
                                const profit = investAmount * returnRate;
                                character.money += (investAmount + profit);

                                character.addSkillProgress("理财能力", 15);

                                if (profit > 0) {
                                    game.addEventLog(`你的投资获得了收益，获得¥${profit.toFixed(2)}。`);
                                } else {
                                    game.addEventLog(`你的投资亏损了，损失¥${Math.abs(profit).toFixed(2)}。`);
                                }
                            } else {
                                game.addEventLog("你没有足够的钱来进行投资。");
                            }

                            game.updateUI();
                        }
                    }
                ]
            },
            "park": {
                id: "park",
                name: "公园",
                description: "这是一个美丽的公园，可以放松身心。",
                options: [
                    {
                        text: "散步",
                        condition: (character) => character.age >= 6,
                        action: (character) => {
                            character.attributes.health += 5;
                            character.attributes.happiness += 5;
                            character.attributes.fitness += 1;
                            game.addEventLog("你在公园散步，体力+5，幸福感+5，体质+1。");
                            game.updateUI();
                        }
                    },
                    {
                        text: "锻炼",
                        condition: (character) => character.age >= 10,
                        action: (character) => {
                            character.attributes.fitness += 5;
                            character.attributes.health -= 5;
                            character.addSkillProgress("体育锻炼", 20);
                            game.addEventLog("你在公园锻炼，体质+5，体力-5，体育锻炼技能进度+20。");
                            game.updateUI();
                        }
                    },
                    {
                        text: "与人交谈",
                        condition: (character) => character.age >= 8,
                        action: (character) => {
                            character.attributes.charm += 3;
                            character.attributes.happiness += 3;
                            character.addSkillProgress("社交能力", 15);
                            game.addEventLog("你在公园与人交谈，魅力+3，幸福感+3，社交能力技能进度+15。");
                            game.updateUI();
                        }
                    },
                    {
                        text: "遇见陌生人",
                        condition: (character) => character.age >= 12,
                        action: (character) => {
                            game.npcManager.interactWithNPC("stranger");
                        }
                    }
                ]
            }
        };

        this.currentScene = "home";
    }

    getScene(sceneId) {
        return this.scenes[sceneId];
    }

    changeScene(sceneId) {
        if (this.scenes[sceneId]) {
            this.currentScene = sceneId;
            this.updateSceneUI();
            game.addEventLog(`你来到了${this.scenes[sceneId].name}。`);
        }
    }

    updateSceneUI() {
        const scene = this.scenes[this.currentScene];
        const descriptionElement = document.getElementById("scene-description");
        const optionsElement = document.getElementById("scene-options");

        descriptionElement.textContent = scene.description;

        optionsElement.innerHTML = "";

        // 添加场景选项
        for (const option of scene.options) {
            if (option.condition(game.character)) {
                const button = document.createElement("button");
                button.className = "action-button scene-option";
                button.textContent = option.text;
                button.addEventListener("click", () => option.action(game.character));
                optionsElement.appendChild(button);
            }
        }

        // 添加场景切换选项
        const sceneSelectionElement = document.createElement("div");
        sceneSelectionElement.className = "scene-selection";
        sceneSelectionElement.style.marginTop = "20px";

        const sceneLabel = document.createElement("div");
        sceneLabel.textContent = "前往:";
        sceneSelectionElement.appendChild(sceneLabel);

        for (const sceneId in this.scenes) {
            if (this.scenes.hasOwnProperty(sceneId) && sceneId !== this.currentScene) {
                const scene = this.scenes[sceneId];

                // 根据生命阶段限制场景访问
                let canAccess = true;
                if (
                    (sceneId === "university" && game.character.lifeStage !== "university") ||
                    (sceneId === "graduate_school" && game.character.lifeStage !== "graduate") ||
                    (sceneId === "phd_program" && game.character.lifeStage !== "phd") ||
                    (sceneId === "work" && game.character.lifeStage !== "society")
                ) {
                    canAccess = false;
                }

                // 学校场景的年龄限制
                if (sceneId === "school" && (game.character.age < 6 || game.character.age >= 22)) {
                    canAccess = false;
                }

                if (canAccess) {
                    const button = document.createElement("button");
                    button.className = "action-button";
                    button.textContent = scene.name;
                    button.addEventListener("click", () => this.changeScene(sceneId));
                    sceneSelectionElement.appendChild(button);
                }
            }
        }

        optionsElement.appendChild(sceneSelectionElement);
    }
}