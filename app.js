// データを格納する変数
let datasets = [];

// DOM要素が読み込まれたら実行
document.addEventListener('DOMContentLoaded', function() {
    // データを読み込む
    fetchData();

    // 検索機能の設定
    document.getElementById('search-input').addEventListener('input', function() {
        filterDataByKeyword(this.value);
    });

    // 戻るボタンの設定
    document.getElementById('back-button').addEventListener('click', function() {
        showDataList();
    });

    // 申請ボタンの設定
    document.getElementById('apply-button').addEventListener('click', function() {
        alert('利用申請フォームへの遷移をシミュレートしています。実際のアプリケーションでは申請フォームに遷移します。');
    });
});

// データの読み込み
function fetchData() {
    fetch('./data/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('データの読み込みに失敗しました。');
            }
            return response.json();
        })
        .then(data => {
            datasets = data.datasets;
            displayDataList(datasets);
        })
        .catch(error => {
            console.error('エラーが発生しました:', error);
            document.getElementById('data-grid').innerHTML = `
                <div class="error-message">
                    <p>データの読み込みに失敗しました。バックアップデータを読み込みます。</p>
                </div>
            `;
            
            // バックアップとして、別の方法でデータを読み込みます
            loadBackupData();
        });
}

// データ一覧の表示
function displayDataList(data) {
    const dataGrid = document.getElementById('data-grid');
    
    if (data.length === 0) {
        dataGrid.innerHTML = '<div class="no-results">検索条件に合致するデータがありません。</div>';
        return;
    }
    
    let html = '';
    
    data.forEach(dataset => {
        // タグHTMLの生成
        let tagsHtml = '';
        if (dataset.tags && dataset.tags.length > 0) {
            dataset.tags.forEach(tag => {
                tagsHtml += `<span class="tag">${tag}</span>`;
            });
        }
        
        html += `
            <div class="data-card" data-id="${dataset.id}">
                <span class="update-date">更新: ${dataset.lastUpdated}</span>
                <h3>${dataset.name}</h3>
                <p>${dataset.description}</p>
                <p class="data-owner">提供: ${dataset.dataOwner}</p>
                <div class="tags">
                    ${tagsHtml}
                </div>
            </div>
        `;
    });
    
    dataGrid.innerHTML = html;
    
    // カードクリックイベントの設定
    document.querySelectorAll('.data-card').forEach(card => {
        card.addEventListener('click', function() {
            console.log('カードがクリックされました: ', this);
            const dataId = parseInt(this.getAttribute('data-id'));
            console.log('データID: ', dataId);
            showDataDetail(dataId);
        });
    });
}

// キーワードによるフィルタリング
function filterDataByKeyword(keyword) {
    if (!keyword || keyword.trim() === '') {
        displayDataList(datasets);
        return;
    }
    
    const normalizedKeyword = keyword.toLowerCase().trim();
    
    const filteredData = datasets.filter(dataset => {
        // 名前、説明、タグ、データ所有者でマッチするか確認
        return (
            dataset.name.toLowerCase().includes(normalizedKeyword) ||
            dataset.description.toLowerCase().includes(normalizedKeyword) ||
            dataset.dataOwner.toLowerCase().includes(normalizedKeyword) ||
            (dataset.tags && dataset.tags.some(tag => tag.toLowerCase().includes(normalizedKeyword)))
        );
    });
    
    displayDataList(filteredData);
}

// データ詳細画面の表示
function showDataDetail(dataId) {
    // データを見つける
    const dataset = datasets.find(d => d.id === dataId);
    
    if (!dataset) {
        console.error('指定されたIDのデータが見つかりません:', dataId);
        return;
    }
    
    console.log('データ詳細を表示: ', dataset);
    
    // タイトルを設定
    document.getElementById('detail-title').textContent = dataset.name;
    
    // サンプルデータテーブルの作成
    const sampleDataContainer = document.getElementById('sample-data');
    
    if (dataset.sampleData && dataset.sampleData.length > 0) {
        const sampleData = dataset.sampleData;
        const columns = Object.keys(sampleData[0]);
        
        let tableHtml = '<table>';
        
        // ヘッダー行
        tableHtml += '<tr>';
        columns.forEach(column => {
            tableHtml += `<th>${column}</th>`;
        });
        tableHtml += '</tr>';
        
        // データ行
        sampleData.forEach(row => {
            tableHtml += '<tr>';
            columns.forEach(column => {
                tableHtml += `<td>${row[column]}</td>`;
            });
            tableHtml += '</tr>';
        });
        
        tableHtml += '</table>';
        sampleDataContainer.innerHTML = tableHtml;
    } else {
        sampleDataContainer.innerHTML = '<p>サンプルデータがありません。</p>';
    }
    
    // ユースケースリストの作成
    const useCasesList = document.getElementById('use-cases-list');
    
    if (dataset.useCases && dataset.useCases.length > 0) {
        let useCasesHtml = '';
        
        dataset.useCases.forEach(useCase => {
            useCasesHtml += `<li>${useCase}</li>`;
        });
        
        useCasesList.innerHTML = useCasesHtml;
    } else {
        useCasesList.innerHTML = '<li>ユースケースがありません。</li>';
    }
    
    // 概要グラフの作成
    const graphContainer = document.getElementById('graph-container');
    
    if (dataset.graphData) {
        graphContainer.innerHTML = '<canvas id="data-chart"></canvas>';
        
        const ctx = document.getElementById('data-chart').getContext('2d');
        
        // グラフタイプに基づいたチャートの作成
        new Chart(ctx, {
            type: dataset.graphData.type,
            data: {
                labels: dataset.graphData.labels,
                datasets: dataset.graphData.datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false
                    }
                }
            }
        });
    } else {
        graphContainer.innerHTML = '<p>グラフデータがありません。</p>';
    }
    
    // ユースケース別のタブと可視化の作成
    const usecaseTabs = document.getElementById('usecase-tabs');
    const usecaseVisualizations = document.getElementById('usecase-visualizations');
    
    if (dataset.useCases && dataset.useCases.length > 0) {
        let tabsHtml = '';
        let visualizationsHtml = '';
        
        // 最大3つのユースケースを表示（すべてを表示すると多すぎるため）
        const maxDisplayUsecases = Math.min(3, dataset.useCases.length);
        
        for (let i = 0; i < maxDisplayUsecases; i++) {
            const usecase = dataset.useCases[i];
            const tabId = `usecase-${i+1}`;
            
            // タブボタンの生成
            tabsHtml += `<button class="tab-button" data-tab="${tabId}">ユースケース ${i+1}</button>`;
            
            // ユースケースごとのグラフコンテナを作成
            visualizationsHtml += `
                <div class="tab-pane" id="${tabId}-tab">
                    <div class="usecase-caption">この可視化は以下のユースケースに対応: "${usecase}"</div>
                    <div class="usecase-graph-container" id="${tabId}-graph">
                        <canvas id="${tabId}-chart"></canvas>
                    </div>
                </div>
            `;
        }
        
        // HTMLを挿入
        usecaseTabs.innerHTML = tabsHtml;
        usecaseVisualizations.innerHTML = visualizationsHtml;
        
        // タブ切り替えイベントの設定
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', function() {
                // すべてのタブからactiveクラスを削除
                document.querySelectorAll('.tab-button').forEach(b => {
                    b.classList.remove('active');
                });
                
                // すべてのタブペインからactiveクラスを削除
                document.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('active');
                });
                
                // クリックされたタブと対応するタブペインをアクティブにする
                this.classList.add('active');
                const tabId = this.getAttribute('data-tab');
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });
        
        // ユースケース別のグラフを生成
        for (let i = 0; i < maxDisplayUsecases; i++) {
            const tabId = `usecase-${i+1}`;
            const chartCanvas = document.getElementById(`${tabId}-chart`);
            if (chartCanvas) {
                const ctx = chartCanvas.getContext('2d');
                // ユースケースに応じて異なるグラフを生成する
                generateUsecaseVisualization(ctx, dataset, i);
            }
        }
    }
    
    // データリスト画面を非表示にし、詳細画面を表示
    console.log('画面を切り替えます');
    document.getElementById('data-list').classList.remove('active');
    document.getElementById('data-list').classList.add('hidden');
    document.getElementById('data-detail').classList.remove('hidden');
    document.getElementById('data-detail').classList.add('active');
}

// データリスト画面の表示（詳細画面から戻る）
function showDataList() {
    document.getElementById('data-detail').classList.remove('active');
    document.getElementById('data-detail').classList.add('hidden');
    document.getElementById('data-list').classList.remove('hidden');
    document.getElementById('data-list').classList.add('active');
    
    // グラフのメモリリーク防止のためにキャンバスをクリア
    const graphContainer = document.getElementById('graph-container');
    graphContainer.innerHTML = '';
}

// バックアップデータをロードする関数
function loadBackupData() {
    // データが読み込めない場合のバックアップとして、サンプルデータをハードコードで提供
    const backupData = {
        "datasets": [
            {
                "id": 1,
                "name": "購買行動分析データ",
                "description": "顧客の購買パターン、商品選択、買い物の頻度などを記録した詳細データセット",
                "dataOwner": "マーケティング部",
                "lastUpdated": "2025-03-15",
                "tags": ["小売", "マーケティング", "顧客行動", "消費者分析"],
                "sampleData": [
                    {"顧客ID": "C001", "年齢": 34, "性別": "女性", "商品カテゴリ": "衣類", "購入金額": 5600, "購入日": "2025-02-10", "店舗": "渋谷店"},
                    {"顧客ID": "C002", "年齢": 42, "性別": "男性", "商品カテゴリ": "電化製品", "購入金額": 64800, "購入日": "2025-02-11", "店舗": "新宿店"},
                    {"顧客ID": "C003", "年齢": 28, "性別": "男性", "商品カテゴリ": "食品", "購入金額": 3200, "購入日": "2025-02-12", "店舗": "池袋店"}
                ],
                "useCases": [
                    "顧客セグメント別の購買行動分析",
                    "商品カテゴリ間の関連性分析",
                    "顧客の生涯価値（LTV）予測"
                ],
                "graphData": {
                    "type": "bar",
                    "labels": ["衣類", "電化製品", "食品", "化粧品", "アクセサリー"],
                    "datasets": [
                        {
                            "label": "カテゴリ別平均購入金額",
                            "data": [8500, 52000, 4300, 9600, 7200],
                            "backgroundColor": "rgba(54, 162, 235, 0.5)"
                        }
                    ]
                }
            },
            {
                "id": 2,
                "name": "工場設備稼働データ",
                "description": "製造ラインの機械稼働状況、メンテナンス履歴、生産効率に関するデータセット",
                "dataOwner": "生産管理部",
                "lastUpdated": "2025-03-20",
                "tags": ["製造", "IoT", "設備管理", "生産効率"],
                "sampleData": [
                    {"設備ID": "M101", "タイプ": "組立ライン", "稼働時間": 168, "停止回数": 2, "生産数": 4200, "不良率": 0.8, "日付": "2025-03-01"},
                    {"設備ID": "M102", "タイプ": "プレス機", "稼働時間": 155, "停止回数": 5, "生産数": 12800, "不良率": 1.2, "日付": "2025-03-01"}
                ],
                "useCases": [
                    "予知保全分析による故障予測",
                    "設備稼働率の最適化分析",
                    "品質管理と不良率の相関分析"
                ],
                "graphData": {
                    "type": "line",
                    "labels": ["3/1", "3/2", "3/3", "3/4", "3/5", "3/6", "3/7"],
                    "datasets": [
                        {
                            "label": "設備稼働率",
                            "data": [93, 89, 91, 87, 92, 95, 94],
                            "borderColor": "rgba(75, 192, 192, 1)",
                            "backgroundColor": "rgba(75, 192, 192, 0.2)",
                            "tension": 0.3
                        }
                    ]
                }
            },
            {
                "id": 3,
                "name": "医療健康記録データ",
                "description": "匿名化された患者の診療記録、検査結果、処方薬などの医療データセット",
                "dataOwner": "医療情報部",
                "lastUpdated": "2025-02-28",
                "tags": ["医療", "ヘルスケア", "診療記録", "匿名化"],
                "sampleData": [
                    {"患者ID": "P00123", "年齢": 52, "性別": "男性", "診断": "高血圧", "検査値": "血圧 145/95", "処方薬": "降圧剤A", "診療日": "2025-02-01"},
                    {"患者ID": "P00456", "年齢": 38, "性別": "女性", "診断": "貧血", "検査値": "ヘモグロビン 10.2", "処方薬": "鉄剤", "診療日": "2025-02-02"}
                ],
                "useCases": [
                    "疾患の早期発見アルゴリズムの開発",
                    "治療効果の予測モデル構築",
                    "医薬品の副作用パターン分析"
                ],
                "graphData": {
                    "type": "pie",
                    "labels": ["高血圧", "貧血", "糖尿病", "関節炎", "喘息", "その他"],
                    "datasets": [
                        {
                            "data": [28, 15, 22, 18, 12, 5],
                            "backgroundColor": [
                                "rgba(255, 99, 132, 0.7)",
                                "rgba(54, 162, 235, 0.7)",
                                "rgba(255, 206, 86, 0.7)",
                                "rgba(75, 192, 192, 0.7)",
                                "rgba(153, 102, 255, 0.7)",
                                "rgba(255, 159, 64, 0.7)"
                            ]
                        }
                    ]
                }
            }
        ]
    };
    
    // バックアップデータを設定して表示
    datasets = backupData.datasets;
    displayDataList(datasets);
}

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
                            label: '買い物頻度',
                            data: [4.2, 3.8, 2.5],
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            order: 2
                        },
                        {
                            label: '平均購入金額',
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
                            label: '満足度スコア',
                            data: [65, 70, 68, 78, 82, 85],
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            tension: 0.3
                        },
                        {
                            label: '絶対購入額',
                            data: [89000, 92000, 87000, 103000, 118000, 125000],
                            borderColor: 'rgba(153, 102, 255, 1)',
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            tension: 0.3,
                            hidden: true
                        }
                    ]
                };
                chartOptions = {
                    responsive: true,
                    maintainAspectRatio: false
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
                    maintainAspectRatio: false
                };
            } else { // その他のユースケース
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
                                size: 14
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
                    maintainAspectRatio: false
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
