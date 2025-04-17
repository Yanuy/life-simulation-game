/**
 * main.js - 游戏主模块
 * 负责整合所有模块，初始化游戏，实现游戏主循环
 */

// 游戏主类
class Game {
    constructor() {
        // 游戏状态
        this.character = null;
        this.itemManager = null;
        this.eventSystem = null;
        this.sceneManager = null;
        this.npcManager = null;
        this.skillSystem = null;
        
        // 特殊状态值存储
        this.specialValues = {};
        
        // 初始化游戏
        this.initialize();
    }
    
    // 初始化游戏
    initialize() {
        // 创建角色
        this.character = new Character();
        
        // 初始化物品管理器
        this.itemManager = new ItemManager();
        
        // 初始化事件系统
        this.eventSystem = new EventSystem();
        
        // 初始化场景管理器
        this.sceneManager = new SceneManager();
        
        // 初始化NPC管理器
        this.npcManager = new NPCManager();
        
        // 初始化技能系统
        this.skillSystem = new SkillSystem();
        
        // 初始化UI
        this.initializeUI();
        
        // 添加初始事件日志
        this.addEventLog('游戏开始！你现在是一个6岁的小学生。');
        
        // 更新UI
        this.character.updateUI();
        
        // 尝试解锁技能
        this.skillSystem.tryUnlockSkills(this.character);
        
        // 渲染技能树
        this.skillSystem.renderSkillTree(this.character);
        
        // 渲染物品栏
        this.itemManager.renderInventory(this.character);
        
        // 渲染商店
        this.itemManager.renderShop(this.character);
        
        // 渲染NPC列表
        this.npcManager.renderNPCList(this.character);
        
        // 渲染场景选择
        this.sceneManager.renderSceneSelection(this.character);
    }
    
    // 初始化UI和事件监听器
    initializeUI() {
        // 初始化标签页切换
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // 移除所有标签页的active类
                tabs.forEach(t => t.classList.remove('active'));
                // 移除所有内容区的active类
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // 添加当前标签页的active类
                tab.classList.add('active');
                // 显示对应的内容区
                const tabId = tab.dataset.tab;
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });
        
        // 初始化时间分配监听器
        this.skillSystem.initializeTimeAllocationListeners(this.character);
        
        // 初始化年度行动按钮
        document.getElementById('next-year').addEventListener('click', () => {
            this.nextYear();
        });
        
        // 初始化模态框关闭按钮
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
            });
        });
    }
    
    // 进入下一年
    nextYear() {
        // 年龄增长
        const result = this.character.ageUp();
        
        // 添加事件日志
        this.addEventLog(`你长大了一岁，现在${result.newAge}岁了。`);
        this.triggerMandatoryAgeEvents();
        if (result.newStage !== this.character.lifeStage) {
            this.addEventLog(`你进入了人生的新阶段：${result.newStage}`);
        }
        
        // 尝试解锁技能
        this.skillSystem.tryUnlockSkills(this.character);
        
        // 随机事件
        this.triggerRandomEvent();
        
        // 更新UI
        this.character.updateUI();
        
        // 更新技能树
        this.skillSystem.renderSkillTree(this.character);
        
        // 更新物品栏
        this.itemManager.renderInventory(this.character);
        
        // 更新商店
        this.itemManager.renderShop(this.character);
        
        // 更新NPC列表
        this.npcManager.renderNPCList(this.character);
        
        // 更新场景
        this.sceneManager.renderSceneSelection(this.character);
    }
    
    // 触发随机事件
    triggerRandomEvent() {
        const event = this.eventSystem.getRandomEvent(this.character);
        
        if (event) {
            this.eventSystem.showEventModal(event, this.character);
        }
    }
    triggerMandatoryAgeEvents() {
        const character = this.character;
        const age = character.age;
        const lifeStage = character.lifeStage;

        // 检查是否有必须触发的特定年龄事件
        if (age === 18 && lifeStage === "义务教育") {
            // 查找高考事件
            const highSchoolExam = this.eventSystem.events["基础教育"].find(
                event => event.id === 'high_school_exam' && event.minAge === 18
            );

            if (highSchoolExam) {
                this.eventSystem.showEventModal(highSchoolExam, character);
                return true;
            }
        }

        // 大学阶段事件触发条件
        if (age === 21 && lifeStage === "大学") {
            const collegeGraduation = this.eventSystem.events["大学"].find(
                event => event.id === 'college_graduation' && event.minAge === 22
            );

            if (collegeGraduation) {
                this.eventSystem.showEventModal(collegeGraduation, character);
                return true;
            }
        }

        return false;
    }

    // 添加事件日志
    static addEventLog(message) {
        const logContainer = document.getElementById('event-log');
        const logItem = document.createElement('div');
        logItem.className = 'event-item';
        logItem.textContent = message;
        
        logContainer.appendChild(logItem);
        logContainer.scrollTop = logContainer.scrollHeight;
    }
    
    // 获取特殊状态值
    static getSpecialValue(key) {
        return window.gameInstance.specialValues[key] || false;
    }
    
    // 设置特殊状态值
    static setSpecialValue(key, value) {
        window.gameInstance.specialValues[key] = value;
    }

    addEventLog(message) {
        const logContainer = document.getElementById('event-log');
        const logItem = document.createElement('div');
        logItem.className = 'event-item';
        logItem.textContent = message;

        logContainer.appendChild(logItem);
        logContainer.scrollTop = logContainer.scrollHeight;
    }
}

// 当文档加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    // 创建游戏实例并保存到全局变量
    window.gameInstance = new Game();
});
