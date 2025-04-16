// 事件管理类
class EventManager {
    constructor() {
        this.events = {
            // 婴幼儿期事件
            "infant": [
                {
                    id: "first_words",
                    title: "第一次开口说话",
                    description: "你说出了人生中的第一个词！",
                    probability: 0.5,
                    minAge: 1,
                    maxAge: 3,
                    options: [
                        {
                            text: "发出简单的声音",
                            effect: (character) => {
                                character.attributes.intelligence += 2;
                                character.attributes.happiness += 5;
                            }
                        },
                        {
                            text: "尝试说出完整的词",
                            effect: (character) => {
                                character.attributes.intelligence += 5;
                                character.attributes.happiness += 2;
                            }
                        }
                    ]
                },
                {
                    id: "first_steps",
                    title: "第一次走路",
                    description: "你尝试站起来，迈出了人生的第一步！",
                    probability: 0.5,
                    minAge: 1,
                    maxAge: 2,
                    options: [
                        {
                            text: "小心翼翼地尝试",
                            effect: (character) => {
                                character.attributes.fitness += 3;
                                character.attributes.health += 2;
                            }
                        },
                        {
                            text: "勇敢地迈出大步",
                            effect: (character) => {
                                character.attributes.fitness += 5;
                                character.attributes.health -= 1;
                            }
                        }
                    ]
                }
            ],
            
            // 儿童期事件
            "child": [
                {
                    id: "first_day_school",
                    title: "第一天上学",
                    description: "今天是你上小学的第一天，你感到既兴奋又紧张。",
                    probability: 1.0,
                    minAge: 6,
                    maxAge: 6,
                    options: [
                        {
                            text: "积极交朋友",
                            effect: (character) => {
                                character.attributes.charm += 5;
                                character.attributes.happiness += 3;
                                character.attributes.intelligence += 2;
                            }
                        },
                        {
                            text: "专注于学习",
                            effect: (character) => {
                                character.attributes.intelligence += 5;
                                character.attributes.happiness += 1;
                                character.attributes.charm += 1;
                            }
                        }
                    ]
                },
                {
                    id: "childhood_hobby",
                    title: "童年爱好",
                    description: "你发现了一个新的爱好，这可能会影响你未来的发展方向。",
                    probability: 0.7,
                    minAge: 7,
                    maxAge: 11,
                    options: [
                        {
                            text: "选择艺术类爱好",
                            effect: (character) => {
                                character.attributes.charm += 5;
                                character.attributes.intelligence += 3;
                                character.attributes.happiness += 5;
                            }
                        },
                        {
                            text: "选择体育类爱好",
                            effect: (character) => {
                                character.attributes.fitness += 5;
                                character.attributes.health += 5;
                                character.attributes.happiness += 5;
                                character.addSkillProgress("体育锻炼", 30);
                            }
                        },
                        {
                            text: "选择科学类爱好",
                            effect: (character) => {
                                character.attributes.intelligence += 8;
                                character.attributes.happiness += 3;
                                character.addSkillProgress("学术基础", 30);
                            }
                        }
                    ]
                },
                {
                    id: "elementary_exam",
                    title: "小学考试",
                    description: "期末考试来临，你需要为此做好准备。",
                    probability: 0.8,
                    minAge: 7,
                    maxAge: 11,
                    options: [
                        {
                            text: "刻苦复习",
                            effect: (character) => {
                                character.attributes.intelligence += 5;
                                character.attributes.happiness -= 3;
                                character.attributes.health -= 5;
                                character.addSkillProgress("学术基础", 40);
                                game.addEventLog("你刻苦复习，考试取得了优异的成绩！");
                            }
                        },
                        {
                            text: "适度复习",
                            effect: (character) => {
                                character.attributes.intelligence += 3;
                                character.attributes.health -= 2;
                                character.addSkillProgress("学术基础", 20);
                                game.addEventLog("你适度复习，考试成绩还不错。");
                            }
                        },
                        {
                            text: "不复习",
                            effect: (character) => {
                                character.attributes.happiness += 5;
                                character.attributes.intelligence -= 1;
                                game.addEventLog("你没有复习，考试成绩不太理想...");
                            }
                        }
                    ]
                }
            ],
            
            // 青少年期事件
            "teen": [
                {
                    id: "puberty",
                    title: "青春期",
                    description: "你进入了青春期，身体和心理都在发生变化。",
                    probability: 1.0,
                    minAge: 12,
                    maxAge: 14,
                    options: [
                        {
                            text: "积极面对变化",
                            effect: (character) => {
                                character.attributes.fitness += 5;
                                character.attributes.charm += 3;
                                character.attributes.happiness += 2;
                            }
                        },
                        {
                            text: "感到迷茫和困惑",
                            effect: (character) => {
                                character.attributes.happiness -= 5;
                                character.attributes.intelligence += 5;
                                character.attributes.charm -= 2;
                            }
                        }
                    ]
                },
                {
                    id: "middle_school_exam",
                    title: "中考",
                    description: "中考即将来临，这关系到你能否进入理想的高中。",
                    probability: 1.0,
                    minAge: 15,
                    maxAge: 15,
                    options: [
                        {
                            text: "拼命复习",
                            effect: (character) => {
                                character.attributes.intelligence += 8;
                                character.attributes.happiness -= 5;
                                character.attributes.health -= 10;
                                character.addSkillProgress("学术基础", 50);
                                
                                if (character.attributes.intelligence >= 60) {
                                    game.addEventLog("你顺利通过中考，进入了一所不错的高中！");
                                } else {
                                    game.addEventLog("你通过了中考，但成绩一般，进入了普通高中。");
                                }
                            }
                        },
                        {
                            text: "平衡学习和休息",
                            effect: (character) => {
                                character.attributes.intelligence += 5;
                                character.attributes.happiness -= 2;
                                character.attributes.health -= 5;
                                character.addSkillProgress("学术基础", 30);
                                
                                if (character.attributes.intelligence >= 55) {
                                    game.addEventLog("你通过了中考，成绩还不错。");
                                } else {
                                    game.addEventLog("你通过了中考，但成绩一般。");
                                }
                            }
                        }
                    ]
                },
                {
                    id: "high_school_friendship",
                    title: "高中友谊",
                    description: "高中时代是建立深厚友谊的黄金时期。",
                    probability: 0.7,
                    minAge: 16,
                    maxAge: 17,
                    options: [
                        {
                            text: "建立深厚友谊",
                            effect: (character) => {
                                character.attributes.happiness += 10;
                                character.attributes.charm += 5;
                                character.addSkillProgress("社交能力", 40);
                                game.npcManager.npcs["friend"].relationship += 30;
                                game.addEventLog("你在高中建立了可能会持续一生的友谊。");
                            }
                        },
                        {
                            text: "专注于学业，较少社交",
                            effect: (character) => {
                                character.attributes.intelligence += 8;
                                character.attributes.happiness -= 3;
                                character.addSkillProgress("学术基础", 40);
                                game.addEventLog("你在高中主要专注于学业，社交较少。");
                            }
                        }
                    ]
                },
                {
                    id: "college_entrance_exam",
                    title: "高考",
                    description: "高考是人生中的重要转折点，将决定你未来的道路。",
                    probability: 1.0,
                    minAge: 18,
                    maxAge: 18,
                    options: [
                        {
                            text: "全力以赴备考",
                            effect: (character) => {
                                character.attributes.intelligence += 15;
                                character.attributes.happiness -= 10;
                                character.attributes.health -= 20;
                                character.addSkillProgress("学术基础", 100);
                                
                                if (character.attributes.intelligence >= 75) {
                                    game.addEventLog("恭喜！你在高考中取得了优异的成绩，被理想的大学录取了！");
                                    // 这里不设置lifeStage，因为在nextYear方法中已经有相关逻辑
                                } else if (character.attributes.intelligence >= 60) {
                                    game.addEventLog("你通过了高考，被一所还不错的大学录取了。");
                                } else {
                                    game.addEventLog("你的高考成绩一般，可能无法进入理想的大学。");
                                }
                            }
                        },
                        {
                            text: "平衡备考和休息",
                            effect: (character) => {
                                character.attributes.intelligence += 10;
                                character.attributes.happiness -= 5;
                                character.attributes.health -= 10;
                                character.addSkillProgress("学术基础", 70);
                                
                                if (character.attributes.intelligence >= 70) {
                                    game.addEventLog("你通过了高考，成绩还不错。");
                                } else if (character.attributes.intelligence >= 55) {
                                    game.addEventLog("你通过了高考，但成绩一般。");
                                } else {
                                    game.addEventLog("你的高考成绩不太理想，可能无法进入理想的大学。");
                                }
                            }
                        }
                    ]
                }
            ],
            
            // 大学期事件
            "university": [
                {
                    id: "university_major",
                    title: "选择专业",
                    description: "进入大学后，你需要选择一个专业方向。",
                    probability: 1.0,
                    minAge: 18,
                    maxAge: 19,
                    options: [
                        {
                            text: "理工科",
                            effect: (character) => {
                                character.attributes.intelligence += 10;
                                character.addSkillProgress("学术基础", 50);
                                character.addSkillProgress("专业技能", 30);
                                game.addEventLog("你选择了理工科专业，开始了新的学习之旅。");
                            }
                        },
                        {
                            text: "文史哲",
                            effect: (character) => {
                                character.attributes.intelligence += 8;
                                character.attributes.charm += 5;
                                character.addSkillProgress("学术基础", 40);
                                character.addSkillProgress("专业技能", 30);
                                game.addEventLog("你选择了文史哲专业，开始了新的学习之旅。");
                            }
                        },
                        {
                            text: "商科",
                            effect: (character) => {
                                character.attributes.intelligence += 6;
                                character.attributes.charm += 8;
                                character.addSkillProgress("社交能力", 40);
                                character.addSkillProgress("专业技能", 30);
                                character.skills["理财能力"].locked = false;
                                game.addEventLog("你选择了商科专业，开始了新的学习之旅。同时解锁了理财能力技能！");
                            }
                        },
                        {
                            text: "艺术",
                            effect: (character) => {
                                character.attributes.charm += 10;
                                character.attributes.happiness += 5;
                                character.addSkillProgress("社交能力", 30);
                                character.addSkillProgress("专业技能", 30);
                                game.addEventLog("你选择了艺术专业，开始了新的学习之旅。");
                            }
                        }
                    ]
                },
                {
                    id: "university_club",
                    title: "加入社团",
                    description: "大学里有各种各样的社团，你想加入哪一个？",
                    probability: 0.8,
                    minAge: 18,
                    maxAge: 21,
                    options: [
                        {
                            text: "学术类社团",
                            effect: (character) => {
                                character.attributes.intelligence += 8;
                                character.addSkillProgress("学术基础", 40);
                                character.addSkillProgress("专业技能", 20);
                                game.addEventLog("你加入了学术类社团，提升了学术能力。");
                            }
                        },
                        {
                            text: "体育类社团",
                            effect: (character) => {
                                character.attributes.fitness += 10;
                                character.attributes.health += 10;
                                character.attributes.charm += 5;
                                character.addSkillProgress("体育锻炼", 50);
                                game.addEventLog("你加入了体育类社团，提升了身体素质。");
                            }
                        },
                        {
                            text: "艺术类社团",
                            effect: (character) => {
                                character.attributes.charm += 8;
                                character.attributes.happiness += 5;
                                character.addSkillProgress("社交能力", 30);
                                game.addEventLog("你加入了艺术类社团，提升了艺术素养和魅力。");
                            }
                        },
                        {
                            text: "创业类社团",
                            effect: (character) => {
                                character.attributes.intelligence += 5;
                                character.attributes.charm += 5;
                                character.addSkillProgress("专业技能", 30);
                                character.skills["理财能力"].locked = false;
                                character.addSkillProgress("理财能力", 20);
                                game.addEventLog("你加入了创业类社团，学习了商业知识。解锁了理财能力技能！");
                            }
                        }
                    ]
                },
                {
                    id: "university_internship",
                    title: "实习机会",
                    description: "你有机会参加一个实习项目，这将是宝贵的经验。",
                    probability: 0.7,
                    minAge: 20,
                    maxAge: 21,
                    options: [
                        {
                            text: "大公司实习",
                            effect: (character) => {
                                character.attributes.intelligence += 5;
                                character.money += 5000;
                                character.addSkillProgress("专业技能", 50);
                                game.addEventLog("你在一家大公司实习，获得了宝贵经验和一些收入。");
                            }
                        },
                        {
                            text: "创业公司实习",
                            effect: (character) => {
                                character.attributes.intelligence += 8;
                                character.money += 3000;
                                character.addSkillProgress("专业技能", 70);
                                game.addEventLog("你在一家创业公司实习，学到了很多实用技能。");
                            }
                        },
                        {
                            text: "研究项目实习",
                            effect: (character) => {
                                character.attributes.intelligence += 10;
                                character.money += 2000;
                                character.addSkillProgress("学术基础", 60);
                                character.addSkillProgress("专业技能", 40);
                                game.addEventLog("你参与了一个研究项目，提升了学术能力。");
                            }
                        }
                    ]
                },
                {
                    id: "university_relationship",
                    title: "大学恋情",
                    description: "在大学期间，你遇到了一个特别的人...",
                    probability: 0.6,
                    minAge: 19,
                    maxAge: 21,
                    options: [
                        {
                            text: "勇敢追求",
                            effect: (character) => {
                                if (character.attributes.charm >= 60) {
                                    character.attributes.happiness += 15;
                                    character.addSkillProgress("社交能力", 40);
                                    game.addEventLog("你勇敢地表白了，对方接受了你的心意。你们开始了一段甜蜜的恋情。");
                                } else {
                                    character.attributes.happiness -= 10;
                                    character.attributes.charm += 5;
                                    character.addSkillProgress("社交能力", 20);
                                    game.addEventLog("你勇敢地表白了，但对方委婉地拒绝了。虽然有些失落，但你学到了宝贵的经验。");
                                }
                            }
                        },
                        {
                            text: "保持距离",
                            effect: (character) => {
                                character.attributes.happiness -= 5;
                                character.attributes.intelligence += 5;
                                game.addEventLog("你选择保持距离，将更多精力投入到学习中。");
                            }
                        }
                    ]
                },
                {
                    id: "graduate_exam",
                    title: "考研决定",
                    description: "大学即将毕业，你需要决定是否考研。",
                    probability: 1.0,
                    minAge: 21,
                    maxAge: 21,
                    options: [
                        {
                            text: "全力备考研究生",
                            effect: (character) => {
                                character.attributes.intelligence += 15;
                                character.attributes.happiness -= 10;
                                character.attributes.health -= 15;
                                character.addSkillProgress("学术基础", 100);
                                character.addSkillProgress("专业技能", 50);
                                
                                // 考研成功率与智力相关
                                if (character.attributes.intelligence >= 85) {
                                    game.addEventLog("恭喜！你成功考上了研究生！");
                                    // 生命阶段变更在nextYear中处理
                                } else {
                                    game.addEventLog("很遗憾，你没有考上研究生。");
                                }
                            }
                        },
                        {
                            text: "直接就业",
                            effect: (character) => {
                                character.lifeStage = "society";
                                character.money += 10000; // 就业奖金
                                character.addSkillProgress("专业技能", 30);
                                game.addEventLog("你选择直接就业，开始了职场生涯。");
                            }
                        }
                    ]
                }
            ],
            
            // 研究生期事件
            "graduate": [
                {
                    id: "research_direction",
                    title: "研究方向",
                    description: "进入研究生阶段，你需要选择一个研究方向。",
                    probability: 1.0,
                    minAge: 22,
                    maxAge: 22,
                    options: [
                        {
                            text: "前沿研究方向",
                            effect: (character) => {
                                character.attributes.intelligence += 12;
                                character.addSkillProgress("学术基础", 70);
                                character.addSkillProgress("专业技能", 50);
                                game.addEventLog("你选择了一个前沿的研究方向，虽然充满挑战，但也有很大的发展空间。");
                            }
                        },
                        {
                            text: "成熟研究方向",
                            effect: (character) => {
                                character.attributes.intelligence += 8;
                                character.addSkillProgress("学术基础", 50);
                                character.addSkillProgress("专业技能", 70);
                                game.addEventLog("你选择了一个相对成熟的研究方向，有稳定的研究路径和就业前景。");
                            }
                        }
                    ]
                },
                {
                    id: "academic_paper",
                    title: "发表论文",
                    description: "研究生期间，发表学术论文是重要的任务。",
                    probability: 0.8,
                    minAge: 23,
                    maxAge: 24,
                    options: [
                        {
                            text: "专注高质量论文",
                            effect: (character) => {
                                character.attributes.intelligence += 15;
                                character.attributes.health -= 10;
                                character.attributes.happiness -= 5;
                                character.addSkillProgress("学术基础", 80);
                                character.addSkillProgress("专业技能", 60);
                                
                                if (character.attributes.intelligence >= 90) {
                                    game.addEventLog("恭喜！你的论文被顶级期刊录用了！这将对你的学术生涯产生重要影响。");
                                } else {
                                    game.addEventLog("你的论文被一个不错的期刊录用了。");
                                }
                            }
                        },
                        {
                            text: "发表多篇一般性论文",
                            effect: (character) => {
                                character.attributes.intelligence += 10;
                                character.attributes.health -= 8;
                                character.addSkillProgress("学术基础", 60);
                                character.addSkillProgress("专业技能", 40);
                                game.addEventLog("你发表了多篇论文，积累了一定的学术成果。");
                            }
                        }
                    ]
                },
                {
                    id: "phd_decision",
                    title: "博士决定",
                    description: "研究生即将毕业，你需要决定是否继续攻读博士学位。",
                    probability: 1.0,
                    minAge: 24,
                    maxAge: 24,
                    options: [
                        {
                            text: "申请博士项目",
                            effect: (character) => {
                                character.attributes.intelligence += 10;
                                character.addSkillProgress("学术基础", 80);
                                character.addSkillProgress("专业技能", 50);
                                
                                // 考博成功率与智力和专业技能相关
                                if (character.attributes.intelligence >= 90 && character.skills["专业技能"].level >= 7) {
                                    game.addEventLog("恭喜！你成功申请到了博士项目！");
                                    // 生命阶段变更在nextYear中处理
                                } else {
                                    game.addEventLog("很遗憾，你的博士申请没有成功。你将开始就业。");
                                    character.lifeStage = "society";
                                }
                            }
                        },
                        {
                            text: "开始就业",
                            effect: (character) => {
                                character.lifeStage = "society";
                                character.money += 15000; // 硕士就业奖金
                                character.addSkillProgress("专业技能", 40);
                                game.addEventLog("你选择直接就业，以硕士学历开始了职场生涯。");
                            }
                        }
                    ]
                }
            ],
            
            // 博士期事件
            "phd": [
                {
                    id: "phd_research",
                    title: "博士研究项目",
                    description: "博士期间，你需要开展一个重要的研究项目。",
                    probability: 1.0,
                    minAge: 25,
                    maxAge: 25,
                    options: [
                        {
                            text: "选择创新性强的课题",
                            effect: (character) => {
                                character.attributes.intelligence += 15;
                                character.attributes.happiness -= 5;
                                character.attributes.health -= 10;
                                character.addSkillProgress("学术基础", 100);
                                character.addSkillProgress("专业技能", 80);
                                game.addEventLog("你选择了一个创新性强的博士研究课题，虽然充满挑战，但也有可能取得突破性成果。");
                            }
                        },
                        {
                            text: "选择相对稳妥的课题",
                            effect: (character) => {
                                character.attributes.intelligence += 10;
                                character.attributes.happiness -= 2;
                                character.attributes.health -= 5;
                                character.addSkillProgress("学术基础", 70);
                                character.addSkillProgress("专业技能", 100);
                                game.addEventLog("你选择了一个相对稳妥的博士研究课题，有明确的研究路径和预期成果。");
                            }
                        }
                    ]
                },
                {
                    id: "international_conference",
                    title: "国际会议",
                    description: "你有机会参加一个重要的国际学术会议。",
                    probability: 0.7,
                    minAge: 26,
                    maxAge: 28,
                    options: [
                        {
                            text: "准备充分，积极参与",
                            effect: (character) => {
                                character.attributes.intelligence += 10;
                                character.attributes.charm += 8;
                                character.attributes.health -= 5;
                                character.addSkillProgress("学术基础", 60);
                                character.addSkillProgress("专业技能", 50);
                                character.addSkillProgress("社交能力", 40);
                                game.addEventLog("你在国际会议上表现出色，拓展了学术视野和人脉。");
                            }
                        },
                        {
                            text: "低调参与，主要学习",
                            effect: (character) => {
                                character.attributes.intelligence += 8;
                                character.attributes.charm += 3;
                                character.addSkillProgress("学术基础", 40);
                                character.addSkillProgress("专业技能", 30);
                                game.addEventLog("你在国际会议上认真学习，获取了许多新知识。");
                            }
                        }
                    ]
                },
                {
                    id: "phd_dissertation",
                    title: "博士论文",
                    description: "博士阶段的终极挑战：完成博士论文。",
                    probability: 1.0,
                    minAge: 28,
                    maxAge: 28,
                    options: [
                        {
                            text: "全力投入博士论文写作",
                            effect: (character) => {
                                character.attributes.intelligence += 20;
                                character.attributes.happiness -= 15;
                                character.attributes.health -= 20;
                                character.addSkillProgress("学术基础", 100);
                                character.addSkillProgress("专业技能", 100);
                                
                                if (character.attributes.intelligence >= 95) {
                                    game.addEventLog("恭喜！你的博士论文获得了优异的评价，这将对你的未来职业生涯产生重要影响。");
                                } else {
                                    game.addEventLog("你顺利完成了博士论文，通过了答辩。");
                                }
                            }
                        },
                        {
                            text: "平衡论文写作和休息",
                            effect: (character) => {
                                character.attributes.intelligence += 15;
                                character.attributes.happiness -= 5;
                                character.attributes.health -= 10;
                                character.addSkillProgress("学术基础", 80);
                                character.addSkillProgress("专业技能", 80);
                                game.addEventLog("你在保持身心健康的同时完成了博士论文。");
                            }
                        }
                    ]
                }
            ],
            
            // 社会期事件
            "society": [
                {
                    id: "first_job",
                    title: "第一份工作",
                    description: "你需要选择你的第一份正式工作。",
                    probability: 1.0,
                    minAge: 22,
                    maxAge: 30,
                    condition: (character) => character.lifeStage === "society" && !character.hadFirstJob,
                    options: [
                        {
                            text: "大型企业",
                            effect: (character) => {
                                character.money += 50000;
                                character.attributes.happiness += 5;
                                character.attributes.health -= 10;
                                character.addSkillProgress("专业技能", 50);
                                character.hadFirstJob = true;
                                game.addEventLog("你加入了一家大型企业，拥有稳定的收入和良好的福利。");
                            }
                        },
                        {
                            text: "创业公司",
                            effect: (character) => {
                                character.money += 30000;
                                character.attributes.happiness += 8;
                                character.attributes.health -= 15;
                                character.addSkillProgress("专业技能", 70);
                                character.skills["理财能力"].locked = false;
                                character.addSkillProgress("理财能力", 30);
                                character.hadFirstJob = true;
                                game.addEventLog("你加入了一家创业公司，工作充满挑战但也有很大的成长空间。同时解锁了理财能力技能！");
                            }
                        },
                        {
                            text: "公务员",
                            effect: (character) => {
                                character.money += 40000;
                                character.attributes.happiness += 3;
                                character.attributes.health -= 5;
                                character.addSkillProgress("专业技能", 40);
                                character.hadFirstJob = true;
                                game.addEventLog("你成为了一名公务员，工作稳定但挑战较少。");
                            }
                        },
                        {
                            text: "自由职业",
                            effect: (character) => {
                                character.money += 20000;
                                character.attributes.happiness += 10;
                                character.attributes.health -= 8;
                                character.addSkillProgress("专业技能", 60);
                                character.skills["理财能力"].locked = false;
                                character.addSkillProgress("理财能力", 50);
                                character.hadFirstJob = true;
                                game.addEventLog("你选择了自由职业，生活更加灵活但收入不太稳定。同时解锁了理财能力技能！");
                            }
                        }
                    ]
                },
                {
                    id: "career_advancement",
                    title: "职业晋升",
                    description: "经过一段时间的工作，你有机会获得晋升。",
                    probability: 0.5,
                    minAge: 25,
                    maxAge: 50,
                    condition: (character) => character.lifeStage === "society" && character.hadFirstJob,
                    options: [
                        {
                            text: "积极争取晋升",
                            effect: (character) => {
                                if (character.attributes.charm >= 70 && character.skills["专业技能"].level >= 5) {
                                    character.money += 20000;
                                    character.attributes.happiness += 10;
                                    character.attributes.health -= 10;
                                    character.addSkillProgress("专业技能", 50);
                                    game.addEventLog("恭喜！你成功获得了晋升，职位和薪资都有了提升。");
                                } else {
                                    character.attributes.happiness -= 5;
                                    character.attributes.health -= 5;
                                    character.addSkillProgress("专业技能", 30);
                                    game.addEventLog("很遗憾，你没有获得晋升。但这次经历让你积累了宝贵的经验。");
                                }
                            }
                        },
                        {
                            text: "保持现状",
                            effect: (character) => {
                                character.money += 5000;
                                character.attributes.happiness += 5;
                                character.attributes.health += 5;
                                character.addSkillProgress("专业技能", 20);
                                game.addEventLog("你选择保持现状，享受当前的工作状态，获得了一些年终奖励。");
                            }
                        }
                    ]
                },
                {
                    id: "investment_opportunity",
                    title: "投资机会",
                    description: "你遇到了一个投资机会，可能带来额外收入。",
                    probability: 0.4,
                    minAge: 25,
                    maxAge: 60,
                    condition: (character) => character.lifeStage === "society" && !character.skills["理财能力"].locked,
                    options: [
                        {
                            text: "大胆投资",
                            effect: (character) => {
                                const investAmount = 50000;
                                if (character.money >= investAmount) {
                                    character.money -= investAmount;
                                    
                                    const financialSkill = character.skills["理财能力"].level;
                                    const randomFactor = Math.random();
                                    const skillBonus = financialSkill * 0.05;
                                    
                                    if (randomFactor + skillBonus > 0.5) {
                                        // 投资成功
                                        const returnRate = 0.5 + randomFactor + skillBonus;
                                        const profit = investAmount * returnRate;
                                        character.money += (investAmount + profit);
                                        character.addSkillProgress("理财能力", 50);
                                        game.addEventLog(`你的投资非常成功！获得了¥${profit.toFixed(2)}的利润。`);
                                    } else {
                                        // 投资失败
                                        const lossRate = 0.3 + (0.5 - randomFactor - skillBonus);
                                        const remainingAmount = investAmount * (1 - lossRate);
                                        character.money += remainingAmount;
                                        character.addSkillProgress("理财能力", 30);
                                        game.addEventLog(`你的投资失败了，损失了¥${(investAmount - remainingAmount).toFixed(2)}。但你从中学到了宝贵的经验。`);
                                    }
                                } else {
                                    game.addEventLog("你没有足够的资金进行这项投资。");
                                }
                            }
                        },
                        {
                            text: "谨慎投资",
                            effect: (character) => {
                                const investAmount = 20000;
                                if (character.money >= investAmount) {
                                    character.money -= investAmount;
                                    
                                    const financialSkill = character.skills["理财能力"].level;
                                    const randomFactor = Math.random();
                                    const skillBonus = financialSkill * 0.05;
                                    
                                    if (randomFactor + skillBonus > 0.3) {
                                        // 投资成功
                                        const returnRate = 0.2 + randomFactor * 0.3 + skillBonus;
                                        const profit = investAmount * returnRate;
                                        character.money += (investAmount + profit);
                                        character.addSkillProgress("理财能力", 30);
                                        game.addEventLog(`你的投资成功了！获得了¥${profit.toFixed(2)}的利润。`);
                                    } else {
                                        // 投资失败
                                        const lossRate = 0.2 * (0.3 - randomFactor - skillBonus) / 0.3;
                                        const remainingAmount = investAmount * (1 - lossRate);
                                        character.money += remainingAmount;
                                        character.addSkillProgress("理财能力", 20);
                                        game.addEventLog(`你的投资小亏，损失了¥${(investAmount - remainingAmount).toFixed(2)}。但风险控制得不错。`);
                                    }
                                } else {
                                    game.addEventLog("你没有足够的资金进行这项投资。");
                                }
                            }
                        },
                        {
                            text: "不投资",
                            effect: (character) => {
                                character.attributes.happiness += 2;
                                game.addEventLog("你选择不参与投资，保持财务稳定。");
                            }
                        }
                    ]
                },
                {
                    id: "health_issue",
                    title: "健康问题",
                    description: "你遇到了一些健康问题，需要处理。",
                    probability: 0.3,
                    minAge: 35,
                    maxAge: 70,
                    options: [
                        {
                            text: "积极治疗和调整生活方式",
                            effect: (character) => {
                                character.money -= 5000;
                                character.attributes.health += 20;
                                character.attributes.happiness += 5;
                                game.addEventLog("你积极面对健康问题，通过治疗和调整生活方式，健康状况得到了改善。");
                            }
                        },
                        {
                            text: "忽视问题，继续工作",
                            effect: (character) => {
                                character.attributes.health -= 15;
                                character.money += 3000;
                                character.attributes.happiness -= 5;
                                game.addEventLog("你选择忽视健康问题，继续专注于工作，但这可能会带来长期的健康风险。");
                            }
                        }
                    ]
                },
                {
                    id: "retirement",
                    title: "退休决定",
                    description: "你已经到了可以考虑退休的年龄。",
                    probability: 1.0,
                    minAge: 60,
                    maxAge: 65,
                    condition: (character) => character.lifeStage === "society" && !character.retired,
                    options: [
                        {
                            text: "选择退休",
                            effect: (character) => {
                                character.retired = true;
                                character.attributes.health += 10;
                                character.attributes.happiness += 10;
                                character.money += character.skills["专业技能"].level * 10000; // 退休金
                                game.addEventLog("你选择退休，开始了人生的新阶段。");
                            }
                        },
                        {
                            text: "继续工作",
                            effect: (character) => {
                                character.money += 30000;
                                character.attributes.health -= 5;
                                character.addSkillProgress("专业技能", 20);
                                game.addEventLog("你选择继续工作，为社会贡献你的经验和智慧。");
                            }
                        }
                    ]
                }
            ],
            
            // 通用事件（适用于所有生命阶段）
            "common": [
                {
                    id: "unexpected_windfall",
                    title: "意外之财",
                    description: "你意外地获得了一笔额外收入。",
                    probability: 0.2,
                    minAge: 18,
                    maxAge: 70,
                    options: [
                        {
                            text: "存起来",
                            effect: (character) => {
                                const amount = 5000 + Math.floor(Math.random() * 5000);
                                character.money += amount;
                                if (!character.skills["理财能力"].locked) {
                                    character.addSkillProgress("理财能力", 20);
                                }
                                game.addEventLog(`你获得了¥${amount}的意外收入，并决定存起来用于未来。`);
                            }
                        },
                        {
                            text: "立即享受",
                            effect: (character) => {
                                const amount = 5000 + Math.floor(Math.random() * 5000);
                                character.money += amount * 0.7; // 享受了一部分，剩下的存起来
                                character.attributes.happiness += 10;
                                game.addEventLog(`你获得了¥${amount}的意外收入，决定用一部分来犒劳自己，提升了幸福感。`);
                            }
                        }
                    ]
                },
                {
                    id: "unexpected_expense",
                    title: "意外支出",
                    description: "你遇到了一笔意外的支出需求。",
                    probability: 0.2,
                    minAge: 18,
                    maxAge: 70,
                    options: [
                        {
                            text: "支付全额",
                            effect: (character) => {
                                const amount = 2000 + Math.floor(Math.random() * 3000);
                                if (character.money >= amount) {
                                    character.money -= amount;
                                    game.addEventLog(`你支付了¥${amount}的意外支出，解决了问题。`);
                                } else {
                                    character.money = 0;
                                    character.attributes.happiness -= 5;
                                    game.addEventLog(`你几乎花光了所有积蓄来支付意外支出，这让你感到有些压力。`);
                                }
                            }
                        },
                        {
                            text: "寻找替代方案",
                            effect: (character) => {
                                const amount = 1000 + Math.floor(Math.random() * 1500);
                                if (character.money >= amount) {
                                    character.money -= amount;
                                    game.addEventLog(`你找到了一个更经济的解决方案，只花费了¥${amount}。`);
                                } else {
                                    character.money = 0;
                                    character.attributes.happiness -= 3;
                                    game.addEventLog("你花光了所有积蓄，但问题没有完全解决，可能后续还需要额外支出。");
                                }
                            }
                        }
                    ]
                },
                {
                    id: "learning_opportunity",
                    title: "学习机会",
                    description: "你遇到了一个提升自己的学习机会。",
                    probability: 0.3,
                    minAge: 16,
                    maxAge: 60,
                    options: [
                        {
                            text: "专业技能学习",
                            effect: (character) => {
                                character.money -= 2000;
                                character.attributes.intelligence += 5;
                                if (!character.skills["专业技能"].locked) {
                                    character.addSkillProgress("专业技能", 40);
                                } else {
                                    character.addSkillProgress("学术基础", 40);
                                }
                                game.addEventLog("你投资于专业技能学习，提升了自己的能力。");
                            }
                        },
                        {
                            text: "兴趣爱好学习",
                            effect: (character) => {
                                character.money -= 1000;
                                character.attributes.happiness += 8;
                                character.attributes.charm += 3;
                                character.addSkillProgress("社交能力", 20);
                                game.addEventLog("你学习了自己感兴趣的内容，提升了幸福感和魅力。");
                            }
                        }
                    ]
                },
                {
                    id: "travel_opportunity",
                    title: "旅行机会",
                    description: "你有机会去旅行，这可能会带来新的体验和见识。",
                    probability: 0.3,
                    minAge: 18,
                    maxAge: 70,
                    options: [
                        {
                            text: "国内旅行",
                            effect: (character) => {
                                character.money -= 5000;
                                character.attributes.happiness += 10;
                                character.attributes.health += 5;
                                character.addSkillProgress("社交能力", 15);
                                game.addEventLog("你进行了一次国内旅行，放松了身心，增长了见识。");
                            }
                        },
                        {
                            text: "国际旅行",
                            effect: (character) => {
                                character.money -= 15000;
                                character.attributes.happiness += 15;
                                character.attributes.health += 3;
                                character.attributes.charm += 5;
                                character.addSkillProgress("社交能力", 30);
                                game.addEventLog("你进行了一次国际旅行，开阔了视野，体验了不同的文化。");
                            }
                        },
                        {
                            text: "放弃旅行",
                            effect: (character) => {
                                character.attributes.happiness -= 3;
                                character.money += 2000; // 省下来的钱用于其他投资
                                game.addEventLog("你决定放弃旅行机会，将资金用于其他方面。");
                            }
                        }
                    ]
                }
            ]
        };
    }
    
    generateRandomEvent(lifeStage) {
        // 收集当前生命阶段的事件以及通用事件
        let possibleEvents = [];
        
        if (this.events[lifeStage]) {
            possibleEvents = possibleEvents.concat(this.events[lifeStage]);
        }
        
        if (this.events.common) {
            possibleEvents = possibleEvents.concat(this.events.common);
        }
        
        // 过滤出符合年龄和条件的事件
        const eligibleEvents = possibleEvents.filter(event => {
            const ageMatch = game.character.age >= event.minAge && game.character.age <= event.maxAge;
            const conditionMatch = !event.condition || event.condition(game.character);
            return ageMatch && conditionMatch;
        });
        
        // 根据概率选择事件
        const randomEvents = eligibleEvents.filter(event => Math.random() < event.probability);
        
        if (randomEvents.length > 0) {
            // 随机选择一个事件
            return randomEvents[Math.floor(Math.random() * randomEvents.length)];
        }
        
        return null;
    }
}