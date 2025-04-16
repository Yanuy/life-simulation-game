// NPC管理类
class NPCManager {
    constructor() {
        this.npcs = {
            "parent": {
                id: "parent",
                name: "父母",
                description: "你的父母，永远支持你的人。",
                relationship: 80, // 0-100
                minAge: 0,
                lifeStages: ["infant", "child", "teen", "university", "graduate", "phd", "society"],
                interactions: [
                    {
                        text: "聊天",
                        condition: (character) => true,
                        effect: (character) => {
                            character.attributes.happiness += 5;
                            this.npcs["parent"].relationship += 3;
                            game.addEventLog("你和父母聊了天，幸福感+5，与父母的关系+3。");
                        }
                    },
                    {
                        text: "请求帮助",
                        condition: (character) => character.age < 22,
                        effect: (character) => {
                            character.attributes.happiness += 3;
                            character.money += 100;
                            this.npcs["parent"].relationship += 1;
                            game.addEventLog("你向父母请求帮助，获得了¥100，幸福感+3，与父母的关系+1。");
                        }
                    },
                    {
                        text: "寻求建议",
                        condition: (character) => character.age >= 10,
                        effect: (character) => {
                            character.attributes.intelligence += 2;
                            this.npcs["parent"].relationship += 2;
                            game.addEventLog("你向父母寻求建议，智力+2，与父母的关系+2。");
                        }
                    }
                ]
            },
            "neighbor": {
                id: "neighbor",
                name: "邻居",
                description: "你的邻居，偶尔会互相帮助。",
                relationship: 50,
                minAge: 6,
                lifeStages: ["child", "teen", "university", "graduate", "phd", "society"],
                interactions: [
                    {
                        text: "聊天",
                        condition: (character) => true,
                        effect: (character) => {
                            character.attributes.charm += 1;
                            character.attributes.happiness += 2;
                            this.npcs["neighbor"].relationship += 2;
                            game.addEventLog("你和邻居聊了天，魅力+1，幸福感+2，与邻居的关系+2。");
                        }
                    },
                    {
                        text: "帮忙",
                        condition: (character) => character.age >= 10,
                        effect: (character) => {
                            character.attributes.health -= 5;
                            character.attributes.happiness += 3;
                            this.npcs["neighbor"].relationship += 5;
                            game.addEventLog("你帮助了邻居，体力-5，幸福感+3，与邻居的关系+5。");
                        }
                    }
                ]
            },
            "teacher": {
                id: "teacher",
                name: "老师",
                description: "你的老师，引导你获取知识的人。",
                relationship: 60,
                minAge: 6,
                lifeStages: ["child", "teen"],
                interactions: [
                    {
                        text: "提问",
                        condition: (character) => character.age >= 6 && character.age < 22,
                        effect: (character) => {
                            character.attributes.intelligence += 3;
                            this.npcs["teacher"].relationship += 2;
                            game.addEventLog("你向老师提出了问题，智力+3，与老师的关系+2。");
                        }
                    },
                    {
                        text: "课后请教",
                        condition: (character) => character.age >= 6 && character.age < 22,
                        effect: (character) => {
                            character.attributes.intelligence += 5;
                            character.attributes.health -= 3;
                            this.npcs["teacher"].relationship += 5;
                            character.addSkillProgress("学术基础", 20);
                            game.addEventLog("你向老师课后请教问题，智力+5，体力-3，与老师的关系+5，学术基础技能进度+20。");
                        }
                    }
                ]
            },
            "professor": {
                id: "professor",
                name: "教授",
                description: "你的大学教授，学术上的引路人。",
                relationship: 60,
                minAge: 18,
                lifeStages: ["university"],
                interactions: [
                    {
                        text: "讨论学术问题",
                        condition: (character) => character.lifeStage === "university",
                        effect: (character) => {
                            character.attributes.intelligence += 5;
                            character.addSkillProgress("学术基础", 15);
                            character.addSkillProgress("专业技能", 10);
                            this.npcs["professor"].relationship += 3;
                            game.addEventLog("你与教授讨论了学术问题，智力+5，学术基础技能进度+15，专业技能进度+10，与教授的关系+3。");
                        }
                    },
                    {
                        text: "请求推荐信",
                        condition: (character) => character.lifeStage === "university" && this.npcs["professor"].relationship >= 80,
                        effect: (character) => {
                            character.attributes.intelligence += 2;
                            this.npcs["professor"].relationship += 1;
                            // 提高考研成功率
                            character.attributes.intelligence += 5;
                            game.addEventLog("你请求教授写推荐信，智力+7，与教授的关系+1。这将有助于你申请研究生。");
                        }
                    }
                ]
            },
            "supervisor": {
                id: "supervisor",
                name: "导师",
                description: "你的研究生/博士导师，学术道路上的重要引导者。",
                relationship: 70,
                minAge: 22,
                lifeStages: ["graduate", "phd"],
                interactions: [
                    {
                        text: "讨论研究方向",
                        condition: (character) => character.lifeStage === "graduate" || character.lifeStage === "phd",
                        effect: (character) => {
                            character.attributes.intelligence += 7;
                            character.addSkillProgress("专业技能", 25);
                            this.npcs["supervisor"].relationship += 5;
                            game.addEventLog("你与导师讨论了研究方向，智力+7，专业技能进度+25，与导师的关系+5。");
                        }
                    },
                    {
                        text: "请求发表论文指导",
                        condition: (character) => (character.lifeStage === "graduate" || character.lifeStage === "phd") && this.npcs["supervisor"].relationship >= 80,
                        effect: (character) => {
                            character.attributes.intelligence += 10;
                            character.addSkillProgress("专业技能", 40);
                            this.npcs["supervisor"].relationship += 2;
                            game.addEventLog("你请求导师指导论文发表，智力+10，专业技能进度+40，与导师的关系+2。");
                        }
                    }
                ]
            },
            "boss": {
                id: "boss",
                name: "上司",
                description: "你的上司，工作中的领导者。",
                relationship: 60,
                minAge: 18,
                lifeStages: ["society"],
                interactions: [
                    {
                        text: "汇报工作",
                        condition: (character) => character.lifeStage === "society",
                        effect: (character) => {
                            character.addSkillProgress("专业技能", 15);
                            this.npcs["boss"].relationship += 3;
                            game.addEventLog("你向上司汇报了工作，专业技能进度+15，与上司的关系+3。");
                        }
                    },
                    {
                        text: "请求加薪",
                        condition: (character) => character.lifeStage === "society" && this.npcs["boss"].relationship >= 85 && character.skills["专业技能"].level >= 5,
                        effect: (character) => {
                            const bonus = 2000 + character.skills["专业技能"].level * 500;
                            character.money += bonus;
                            this.npcs["boss"].relationship -= 5;
                            game.addEventLog(`你向上司请求加薪，获得了¥${bonus}的奖金，但与上司的关系-5。`);
                        }
                    },
                    {
                        text: "寻求职业建议",
                        condition: (character) => character.lifeStage === "society",
                        effect: (character) => {
                            character.addSkillProgress("专业技能", 10);
                            character.attributes.intelligence += 3;
                            this.npcs["boss"].relationship += 2;
                            game.addEventLog("你向上司寻求职业建议，专业技能进度+10，智力+3，与上司的关系+2。");
                        }
                    }
                ]
            },
            "friend": {
                id: "friend",
                name: "朋友",
                description: "你的好朋友，生活中的伙伴。",
                relationship: 70,
                minAge: 6,
                lifeStages: ["child", "teen", "university", "graduate", "phd", "society"],
                interactions: [
                    {
                        text: "聊天",
                        condition: (character) => true,
                        effect: (character) => {
                            character.attributes.happiness += 8;
                            character.attributes.charm += 2;
                            this.npcs["friend"].relationship += 3;
                            game.addEventLog("你和朋友聊天，幸福感+8，魅力+2，与朋友的关系+3。");
                        }
                    },
                    {
                        text: "一起娱乐",
                        condition: (character) => true,
                        effect: (character) => {
                            character.attributes.happiness += 10;
                            character.attributes.health -= 5;
                            character.money -= 100;
                            this.npcs["friend"].relationship += 5;
                            game.addEventLog("你和朋友一起玩耍，幸福感+10，体力-5，花费¥100，与朋友的关系+5。");
                        }
                    },
                    {
                        text: "相互学习",
                        condition: (character) => character.age >= 12,
                        effect: (character) => {
                            character.attributes.intelligence += 4;
                            character.addSkillProgress("社交能力", 15);
                            this.npcs["friend"].relationship += 4;
                            game.addEventLog("你和朋友相互学习，智力+4，社交能力技能进度+15，与朋友的关系+4。");
                        }
                    }
                ]
            },
            "stranger": {
                id: "stranger",
                name: "陌生人",
                description: "你遇到的陌生人，可能会带来意想不到的机会。",
                relationship: 30,
                minAge: 12,
                lifeStages: ["teen", "university", "graduate", "phd", "society"],
                interactions: [
                    {
                        text: "简单交谈",
                        condition: (character) => true,
                        effect: (character) => {
                            character.attributes.charm += 3;
                            character.addSkillProgress("社交能力", 20);
                            this.npcs["stranger"].relationship += 10;
                            game.addEventLog("你与陌生人简单交谈，魅力+3，社交能力技能进度+20，与陌生人的关系+10。");
                        }
                    },
                    {
                        text: "深入交流",
                        condition: (character) => this.npcs["stranger"].relationship >= 50,
                        effect: (character) => {
                            character.attributes.charm += 5;
                            character.attributes.intelligence += 3;
                            character.addSkillProgress("社交能力", 30);
                            this.npcs["stranger"].relationship += 20;
                            
                            // 随机事件 - 陌生人可能成为朋友
                            if (Math.random() < 0.3) {
                                this.npcs["friend"].relationship += 10;
                                game.addEventLog("你与陌生人深入交流，魅力+5，智力+3，社交能力技能进度+30，与陌生人的关系+20。这个陌生人成为了你的朋友！");
                            } else {
                                game.addEventLog("你与陌生人深入交流，魅力+5，智力+3，社交能力技能进度+30，与陌生人的关系+20。");
                            }
                        }
                    }
                ]
            }
        };
    }
    
    getNPC(npcId) {
        return this.npcs[npcId];
    }
    getAvailableNPCs(age, lifeStage) {
        const availableNPCs = {};

        for (const npcId in this.npcs) {
            // Add hasOwnProperty check to prevent prototype pollution
            if (Object.prototype.hasOwnProperty.call(this.npcs, npcId)) {
                const npc = this.npcs[npcId];
                if (age >= npc.minAge && (npc.lifeStages.includes(lifeStage) || npc.lifeStages.includes("all"))) {
                    availableNPCs[npcId] = npc;
                }
            }
        }

        return availableNPCs;
    }

    interactWithNPC(npcId) {
        // Check if npcId is valid and is an own property
        if (!Object.prototype.hasOwnProperty.call(this.npcs, npcId)) {
            return;
        }

        const npc = this.npcs[npcId];

        if (!npc) return;

        // 检查是否可以与该NPC互动
        if (
            game.character.age < npc.minAge ||
            (!npc.lifeStages.includes(game.character.lifeStage) && !npc.lifeStages.includes("all"))
        ) {
            game.addEventLog(`你不能与${npc.name}互动。`);
            return;
        }

        // 显示互动模态框
        const modal = document.getElementById("interaction-modal");
        const title = document.getElementById("interaction-title");
        const container = document.getElementById("interaction-container");

        title.textContent = `与${npc.name}互动`;

        // 清除之前的互动选项
        container.innerHTML = "";

        // 添加NPC描述
        const description = document.createElement("p");
        description.textContent = npc.description;
        container.appendChild(description);

        // 添加关系状态
        const relationship = document.createElement("p");
        relationship.textContent = `关系: ${this.getRelationshipDescription(npc.relationship)}`;
        container.appendChild(relationship);

        // 添加互动选项
        const options = document.createElement("div");
        options.className = "interaction-options";

        for (const interaction of npc.interactions) {
            if (interaction.condition(game.character)) {
                const button = document.createElement("button");
                button.className = "action-button";
                button.textContent = interaction.text;
                button.addEventListener("click", () => {
                    interaction.effect(game.character);
                    modal.style.display = "none";
                    game.updateUI();
                });
                options.appendChild(button);
            }
        }

        container.appendChild(options);

        modal.style.display = "block";
    }

    getRelationshipDescription(value) {
        if (value >= 90) return "亲密无间";
        if (value >= 80) return "非常亲近";
        if (value >= 70) return "亲近";
        if (value >= 60) return "友好";
        if (value >= 50) return "和善";
        if (value >= 40) return "一般";
        if (value >= 30) return "略微疏远";
        if (value >= 20) return "疏远";
        if (value >= 10) return "冷淡";
        return "敌对";
    }

    updateRelationships(character) {
        // 每年关系自然衰减
        for (const npcId in this.npcs) {
            // Add hasOwnProperty check
            if (Object.prototype.hasOwnProperty.call(this.npcs, npcId)) {
                const npc = this.npcs[npcId];
                if (npc.relationship > 0) {
                    npc.relationship = Math.max(npc.relationship - 3, 0);
                }
            }
        }
    }

    updateRelationshipsUI() {
        const container = document.getElementById("relations-container");
        container.innerHTML = "";

        const availableNPCs = this.getAvailableNPCs(game.character.age, game.character.lifeStage);

        if (Object.keys(availableNPCs).length === 0) {
            container.innerHTML = "<p>当前没有可互动的人物。</p>";
            return;
        }

        for (const npcId in availableNPCs) {
            // Still need hasOwnProperty check even though availableNPCs should be clean
            if (Object.prototype.hasOwnProperty.call(availableNPCs, npcId)) {
                const npc = availableNPCs[npcId];

                const npcElement = document.createElement("div");
                npcElement.className = "npc";
                npcElement.innerHTML = `
                    <div class="npc-name">${npc.name}</div>
                    <div class="npc-relationship">${this.getRelationshipDescription(npc.relationship)}</div>
                    <div class="skill-description">${npc.description}</div>
                `;

                npcElement.addEventListener("click", () => {
                    this.interactWithNPC(npcId);
                });

                container.appendChild(npcElement);
            }
        }
    }
}