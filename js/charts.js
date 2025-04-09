// ユースケース別の可視化を生成する関数
function generateUsecaseVisualization(ctx, dataset, usecaseIndex) {
    // データセットの種類やユースケースに基づいて適切な可視化を生成
    let chartType, chartData, chartOptions;
    
    // 各データセットやユースケースに応じた可視化を生成
    switch(dataset.id) {
        case 1: // 購買行動分析データ
            if (usecaseIndex === 0) { // 顧客セグメント別の購買行動分析
                chartType = 'bar';
                chartData = {
                    labels: ['年齢20代', '年齢30代', '年齢40以上'],
                    datasets: [
                        {
                            label: '買い物頻度（月間）',
                            data: [4.2, 3.8, 2.5],
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            order: 2
                        },
                        {
                            label: '平均購入金額（円）',
                            data: [4800, 9500, 15200],
                            type: 'line',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            yAxisID: 'y1',
                            order: 1
                        }
                    ]
                };
                chartOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: '年齢層別購買行動分析',
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: '月間買い物頻度'
                            }
                        },
                        y1: {
                            beginAtZero: true,
                            position: 'right',
                            grid: {
                                drawOnChartArea: false
                            },
                            title: {
                                display: true,
                                text: '平均購入金額（円）'
                            }
                        }
                    }
                };
            } else if (usecaseIndex === 1) { // 商品カテゴリ間の関連性分析
                chartType = 'radar';
                chartData = {
                    labels: ['衣類', '電化製品', '食品', '化粧品', 'アクセサリー'],
                    datasets: [
                        {
                            label: '女性客',
                            data: [85, 40, 65, 90, 75],
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            pointBackgroundColor: 'rgba(255, 99, 132, 1)'
                        },
                        {
                            label: '男性客',
                            data: [55, 90, 75, 25, 45],
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            pointBackgroundColor: 'rgba(54, 162, 235, 1)'
                        }
                    ]
                };
                chartOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: '性別ごとの商品カテゴリ購入傾向',
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        }
                    },
                    elements: {
                        line: {
                            borderWidth: 2
                        }
                    },
                    scales: {
                        r: {
                            angleLines: {
                                display: true
                            },
                            suggestedMin: 0,
                            suggestedMax: 100
                        }
                    }
                };
            } else { // その他のユースケース
                chartType = 'line';
                chartData = {
                    labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
                    datasets: [
                        {
                            label: '顧客満足度スコア',
                            data: [65, 70, 68, 78, 82, 85],
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            tension: 0.3
                        },
                        {
                            label: '平均購入額（千円）',
                            data: [89, 92, 87, 103, 118, 125],
                            borderColor: 'rgba(153, 102, 255, 1)',
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            tension: 0.3
                        }
                    ]
                };
                chartOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: '顧客満足度と購入金額の相関',
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        }
                    }
                };
            }
            break;
            
        case 2: // 工場設備稼働データ
            if (usecaseIndex === 0) { // 予知保全分析による故障予測
                chartType = 'line';
                chartData = {
                    labels: ['-14日', '-12日', '-10日', '-8日', '-6日', '-4日', '-2日', '故障発生'],
                    datasets: [
                        {
                            label: '振動数値',
                            data: [2.1, 2.2, 2.3, 2.8, 3.2, 4.1, 5.8, 8.2],
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            tension: 0.3,
                            pointRadius: 4,
                            pointHoverRadius: 6
                        },
                        {
                            label: '警告レベル',
                            data: [4, 4, 4, 4, 4, 4, 4, 4],
                            borderColor: 'rgba(255, 159, 64, 0.8)',
                            borderDash: [5, 5],
                            fill: false,
                            pointRadius: 0
                        }
                    ]
                };
                chartOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: '設備故障前の異常検知パターン',
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        }
                    }
                };
            } else if (usecaseIndex === 1) { // 設備稼働率の最適化分析
                chartType = 'scatter';
                chartData = {
                    datasets: [
                        {
                            label: '稼働率 vs 不良率',
                            data: [
                                {x: 92, y: 1.2},
                                {x: 88, y: 1.8},
                                {x: 90, y: 1.3},
                                {x: 94, y: 0.9},
                                {x: 96, y: 0.7},
                                {x: 86, y: 2.1},
                                {x: 89, y: 1.5},
                                {x: 91, y: 1.1},
                                {x: 87, y: 1.9},
                                {x: 93, y: 1.0},
                                {x: 95, y: 0.8},
                                {x: 85, y: 2.2}
                            ],
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            pointRadius: 6
                        }
                    ]
                };
                chartOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: '生産設備の稼働率と不良率の関係',
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: '稼働率 (%)'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: '不良率 (%)'
                            }
                        }
                    }
                };
            } else { // 品質管理と不良率の相関分析
                chartType = 'bar';
                chartData = {
                    labels: ['組立ライン', 'プレス機', '塗装ライン', '検査装置', '包装機'],
                    datasets: [
                        {
                            label: '平均不良率 (%)',
                            data: [0.8, 1.2, 1.5, 0.3, 0.5],
                            backgroundColor: 'rgba(255, 99, 132, 0.5)'
                        },
                        {
                            label: 'メンテナンス頻度 (月次)',
                            data: [2, 4, 3, 1, 1],
                            backgroundColor: 'rgba(54, 162, 235, 0.5)'
                        }
                    ]
                };
                chartOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: '設備タイプ別の不良率とメンテナンス頻度',
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        }
                    }
                };
            }
            break;
            
        case 3: // 医療健康記録データ
            if (usecaseIndex === 0) { // 疾患の早期発見アルゴリズム
                chartType = 'bar';
                chartData = {
                    labels: ['高血圧', '2型糖尿病', '貧血', '甲状腺機能低下症', '喘息'],
                    datasets: [
                        {
                            label: '早期発見率 (%)',
                            data: [68, 45, 72, 58, 63],
                            backgroundColor: 'rgba(75, 192, 192, 0.5)'
                        },
                        {
                            label: '5年生存率 (%)',
                            data: [92, 84, 95, 90, 88],
                            backgroundColor: 'rgba(153, 102, 255, 0.5)'
                        }
                    ]
                };
                chartOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: '早期発見率と5年生存率の関係',
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        }
                    }
                };
            } else { // その他の医療ユースケース
                chartType = 'line';
                chartData = {
                    labels: ['初診', '1ヶ月後', '3ヶ月後', '6ヶ月後', '12ヶ月後'],
                    datasets: [
                        {
                            label: '標準治療グループ',
                            data: [100, 85, 75, 68, 65],
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            tension: 0.3
                        },
                        {
                            label: '新薬治療グループ',
                            data: [100, 80, 65, 52, 42],
                            borderColor: 'rgba(54, 162, 235, 1)',
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            tension: 0.3
                        }
                    ]
                };
                chartOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: '治療方法による症状改善の比較',
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        }
                    },
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: '症状スコア（低いほど改善）'
                            }
                        }
                    }
                };
            }
            break;
            
        default: // その他のデータセット
            // データセットの基本的なグラフ形式に少しアレンジを加える
            if (dataset.graphData) {
                chartType = dataset.graphData.type === 'bar' ? 'bar' : 'line';
                chartData = {
                    labels: dataset.graphData.labels,
                    datasets: dataset.graphData.datasets.map(ds => {
                        // 色やスタイルを少し変更
                        const newDs = {...ds};
                        if (chartType === 'bar') {
                            newDs.backgroundColor = 'rgba(153, 102, 255, 0.5)';
                        } else {
                            newDs.borderColor = 'rgba(255, 159, 64, 1)';
                            newDs.backgroundColor = 'rgba(255, 159, 64, 0.2)';
                            newDs.tension = 0.4;
                        }
                        return newDs;
                    })
                };
                chartOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: `${dataset.useCases[usecaseIndex]}に基づく分析`,
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        }
                    }
                };
            } else {
                // グラフデータがない場合はダミーの円グラフを表示
                chartType = 'doughnut';
                chartData = {
                    labels: ['カテゴリーA', 'カテゴリーB', 'カテゴリーC', 'カテゴリーD'],
                    datasets: [{
                        data: [35, 25, 22, 18],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(255, 206, 86, 0.5)',
                            'rgba(75, 192, 192, 0.5)'
                        ]
                    }]
                };
                chartOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'サンプルデータ分析',
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        }
                    }
                };
            }
            break;
    }
    
    // チャートの生成
    new Chart(ctx, {
        type: chartType,
        data: chartData,
        options: chartOptions
    });
}
