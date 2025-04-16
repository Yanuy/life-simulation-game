// 主游戏逻辑
class Game {
    constructor() {
        this.character = new Character();
        this.itemManager = new ItemManager();
        this.sceneManager = new SceneManager();
        this.npcManager = new NPCManager();
        this.skillManager = new SkillManager();
        this.eventManager = new EventManager();

        this.timeAllocation = {
            study: 20,
            entertainment: 20,
            fitness: 10,
            social: 10,
            work: 0,
            remaining: 40
        };

        this.initializeUI();
        this.setupEventListeners();
        this.updateUI();

        // 开始游戏
        this.addEventLog("你出生了，新的人生即将开始！");
        this.sceneManager.changeScene("home");
    }

    initializeUI() {
        // 初始化标签页
        document.querySelectorAll(".tab").forEach(tab => {
            tab.addEventListener("click", () => {
                // 移除所有活动标签类
                document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
                document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

                // 添加活动标签类到点击的标签
                tab.classList.add("active");
                const tabId = tab.getAttribute("data-tab");
                document.getElementById(`${tabId}-tab`).classList.add("active");
            });
        });

        // 初始化时间分配滑块
        const sliders = document.querySelectorAll(".time-slider");
        sliders.forEach(slider => {
            slider.addEventListener("input", () => this.updateTimeAllocation());
        });

        // 保存时间分配按钮
        document.getElementById("save-time-allocation").addEventListener("click", () => {
            this.addEventLog("你调整了时间分配计划。");
        });

        // 下一年按钮
        document.getElementById("next-year").addEventListener("click", () => this.nextYear());

        // 关闭模态窗口按钮
        document.getElementById("close-event-modal").addEventListener("click", () => {
            document.getElementById("event-modal").style.display = "none";
        });

        document.getElementById("close-interaction-modal").addEventListener("click", () => {
            document.getElementById("interaction-modal").style.display = "none";
        });
    }

    setupEventListeners() {
        // 这里将添加更多的事件监听器
    }

    updateTimeAllocation() {
        const studyTime = parseInt(document.getElementById("study-time").value);
        const entertainmentTime = parseInt(document.getElementById("entertainment-time").value);
        const fitnessTime = parseInt(document.getElementById("fitness-time").value);
        const socialTime = parseInt(document.getElementById("social-time").value);
        const workTime = parseInt(document.getElementById("work-time").value);

        const totalAllocated = studyTime + entertainmentTime + fitnessTime + socialTime + workTime;
        const remaining = Math.max(0, 100 - totalAllocated);

        document.getElementById("study-time-value").textContent = studyTime + "%";
        document.getElementById("entertainment-time-value").textContent = entertainmentTime + "%";
        document.getElementById("fitness-time-value").textContent = fitnessTime + "%";
        document.getElementById("social-time-value").textContent = socialTime + "%";
        document.getElementById("work-time-value").textContent = workTime + "%";
        document.getElementById("remaining-time-value").textContent = remaining + "%";

        this.timeAllocation = {
            study: studyTime,
            entertainment: entertainmentTime,
            fitness: fitnessTime,
            social: socialTime,
            work: workTime,
            remaining: remaining
        };

        // 检查是否超过100%
        if (totalAllocated > 100) {
            document.getElementById("save-time-allocation").disabled = true;
            document.getElementById("remaining-time-value").style.color = "red";
        } else {
            document.getElementById("save-time-allocation").disabled = false;
            document.getElementById("remaining-time-value").style.color = "";
        }
    }

    nextYear() {
        // 增加年龄
        this.character.age++;

        // 根据时间分配更新属性
        this.character.applyTimeAllocation(this.timeAllocation);

        // 检查生命阶段变化
        this.character.checkLifeStageChange();

        // 随机事件
        const event = this.eventManager.generateRandomEvent(this.character.lifeStage);
        if (event) {
            this.showEvent(event);
        }

        // 更新NPC关系
        this.npcManager.updateRelationships(this.character);

        // 更新技能
        this.skillManager.updateSkills(this.character, this.timeAllocation);

        // 更新UI
        this.updateUI();

        // 添加年度总结到事件日志
        this.addEventLog(`你度过了${this.character.age}岁的一年。`);

        // 特殊生命阶段事件
        if (this.character.age === 6) {
            this.addEventLog("你开始了小学生活。");
        } else if (this.character.age === 12) {
            this.addEventLog("你进入了初中阶段。");
        } else if (this.character.age === 15) {
            this.addEventLog("你开始了高中生活。");
        } else if (this.character.age === 18) {
            // 检查是否可以上大学
            if (this.character.attributes.intelligence >= 70) {
                this.character.lifeStage = "university";
                this.addEventLog("恭喜！你考上了大学。");

                // 解锁新技能
                this.skillManager.unlockSkill("专业技能");

                // 更新场景
                this.sceneManager.changeScene("university");
            } else {
                this.character.lifeStage = "society";
                this.addEventLog("你没有考上大学，开始了社会生活。");

                // 解锁新技能
                this.skillManager.unlockSkill("专业技能");

                // 更新场景
                this.sceneManager.changeScene("work");
            }
        } else if (this.character.age === 22 && this.character.lifeStage === "university") {
            // 检查是否可以读研
            if (this.character.attributes.intelligence >= 85) {
                this.character.lifeStage = "graduate";
                this.addEventLog("恭喜！你考上了研究生。");

                // 更新场景
                this.sceneManager.changeScene("graduate_school");
            } else {
                this.character.lifeStage = "society";
                this.addEventLog("你大学毕业了，开始了社会生活。");

                // 更新场景
                this.sceneManager.changeScene("work");
            }
        } else if (this.character.age === 25 && this.character.lifeStage === "graduate") {
            // 检查是否可以读博
            if (this.character.attributes.intelligence >= 90 && this.character.skills["专业技能"].level >= 7) {
                this.character.lifeStage = "phd";
                this.addEventLog("恭喜！你开始了博士学习。");

                // 更新场景
                this.sceneManager.changeScene("phd_program");
            } else {
                this.character.lifeStage = "society";
                this.addEventLog("你研究生毕业了，开始了社会生活。");

                // 更新场景
                this.sceneManager.changeScene("work");
            }
        } else if (this.character.age === 29 && this.character.lifeStage === "phd") {
            this.character.lifeStage = "society";
            this.addEventLog("你博士毕业了，开始了社会生活。");

            // 更新场景
            this.sceneManager.changeScene("work");
        }

        // 检查游戏结束条件
        if (this.character.age >= 80) {
            this.endGame();
        }
    }

    showEvent(event) {
        const modal = document.getElementById("event-modal");
        const title = document.getElementById("event-title");
        const description = document.getElementById("event-description");
        const options = document.getElementById("event-options");

        title.textContent = event.title;
        description.textContent = event.description;

        // 清除之前的选项
        options.innerHTML = "";

        // 添加新选项
        event.options.forEach(option => {
            const button = document.createElement("button");
            button.className = "action-button";
            button.textContent = option.text;
            button.addEventListener("click", () => {
                option.effect(this.character);
                this.addEventLog(`事件: ${event.title} - 你选择了: ${option.text}`);
                modal.style.display = "none";
                this.updateUI();
            });
            options.appendChild(button);
        });

        modal.style.display = "block";
    }

    addEventLog(message) {
        const eventLog = document.getElementById("event-log");
        const eventItem = document.createElement("div");
        eventItem.className = "event-item";
        eventItem.textContent = message;
        eventLog.prepend(eventItem);
    }

    updateUI() {
        // 更新基本信息
        document.getElementById("age").textContent = this.character.age;
        document.getElementById("life-stage").textContent = this.character.getLifeStageText();
        document.getElementById("money").textContent = this.character.money.toFixed(2);

        // 更新属性
        for (const attr in this.character.attributes) {
            if (this.character.attributes.hasOwnProperty(attr)) {
                const value = this.character.attributes[attr];
                const elementId = `${attr}-value`;
                const barId = `${attr}-bar`;

                if (document.getElementById(elementId)) {
                    document.getElementById(elementId).textContent = Math.floor(value);
                    document.getElementById(barId).style.width = `${value}%`;
                }
            }
        }

        // 更新技能
        for (const skillName in this.character.skills) {
            if (this.character.skills.hasOwnProperty(skillName)) {
                const skill = this.character.skills[skillName];
                const levelElement = document.getElementById(`${this.skillManager.getSkillId(skillName)}-level`);
                const progressElement = document.getElementById(`${this.skillManager.getSkillId(skillName)}-progress`);

                if (levelElement && progressElement) {
                    levelElement.textContent = skill.level;
                    progressElement.style.width = `${skill.progress}%`;
                }
            }
        }

        // 更新物品栏
        this.itemManager.updateInventoryUI(this.character.inventory);

        // 更新商店
        this.itemManager.updateShopUI(this.character.lifeStage, this.character.money);

        // 更新场景
        this.sceneManager.updateSceneUI();

        // 更新关系
        this.npcManager.updateRelationshipsUI();
    }

    endGame() {
        this.addEventLog("你的人生旅程结束了。");

        const modal = document.getElementById("event-modal");
        const title = document.getElementById("event-title");
        const description = document.getElementById("event-description");
        const options = document.getElementById("event-options");

        title.textContent = "人生的终点";

        // 生成人生总结
        let summary = "你的人生总结：\n\n";
        summary += `你活到了${this.character.age}岁。\n`;
        summary += `你积累了¥${this.character.money.toFixed(2)}的财富。\n`;
        summary += `你的最终属性：\n`;
        for (const attr in this.character.attributes) {
            if (this.character.attributes.hasOwnProperty(attr)) {
                summary += `- ${this.getAttributeDisplayName(attr)}: ${Math.floor(this.character.attributes[attr])}\n`;
            }
        }

        summary += `\n你的最终技能：\n`;
        for (const skillName in this.character.skills) {
            if (this.character.skills.hasOwnProperty(skillName) && this.character.skills[skillName].level > 0) {
                summary += `- ${skillName}: Lv.${this.character.skills[skillName].level}\n`;
            }
        }

        description.textContent = summary;

        // 清除之前的选项
        options.innerHTML = "";

        // 添加重新开始按钮
        const button = document.createElement("button");
        button.className = "action-button";
        button.textContent = "重新开始";
        button.addEventListener("click", () => {
            location.reload();
        });
        options.appendChild(button);

        modal.style.display = "block";

        // 禁用下一年按钮
        document.getElementById("next-year").disabled = true;
    }

    getAttributeDisplayName(attr) {
        const displayNames = {
            health: "体力",
            intelligence: "智力",
            charm: "魅力",
            fitness: "体质",
            happiness: "幸福感"
        };
        return displayNames[attr] || attr;
    }
}

// 启动游戏
document.addEventListener("DOMContentLoaded", () => {
    window.game = new Game();
});