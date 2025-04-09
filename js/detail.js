// データ詳細画面の表示
function showDataDetail(dataId) {
    // データを見つける
    const dataset = datasets.find(d => d.id === dataId);
    
    if (!dataset) {
        console.error('指定されたIDのデータが見つかりません:', dataId);
        return;
    }
    
    // タイトルを設定
    document.getElementById('detail-title').textContent = dataset.name;
    
    // 詳細ページのメタ情報を設定
    document.getElementById('data-owner').textContent = `提供元：${dataset.dataOwner}`;
    document.getElementById('data-updated').textContent = `最終更新：${dataset.lastUpdated}`;
    
    // タグを表示
    const tagsContainer = document.getElementById('data-tags');
    if (dataset.tags && dataset.tags.length > 0) {
        let tagsHtml = '';
        dataset.tags.forEach(tag => {
            tagsHtml += `<span class="detail-tag">${tag}</span>`;
        });
        tagsContainer.innerHTML = tagsHtml;
    } else {
        tagsContainer.innerHTML = '';
    }
    
    // サンプルデータテーブルの作成
    const sampleDataContainer = document.getElementById('sample-data');
    
    if (dataset.sampleData && dataset.sampleData.length > 0) {
        const sampleData = dataset.sampleData;
        const columns = Object.keys(sampleData[0]);
        
        // サンプルデータを拡張して両右バランスよく10行表示
        const expandedData = [];
        
        // オリジナルのデータ数を取得
        const originalRowCount = sampleData.length;
        // 追加する行数を計算（10行になるように調整）
        const rowsToAdd = 10 - originalRowCount;
        
        // オリジナルデータをまず追加
        sampleData.forEach(row => {
            expandedData.push({...row});
        });
        
        // 必要な数の行を追加
        if (rowsToAdd > 0) {
            for (let i = 0; i < rowsToAdd; i++) {
                // ランダムにオリジナルデータから行を選んで変化させる
                const baseRowIndex = i % originalRowCount;
                const baseRow = sampleData[baseRowIndex];
                const modifiedRow = {...baseRow};
                
                // 数値フィールドを変更
                Object.keys(modifiedRow).forEach(key => {
                    if (typeof modifiedRow[key] === 'number') {
                        // ランダムに±15%変動させる
                        const variation = 0.85 + Math.random() * 0.3; // 0.85 to 1.15
                        modifiedRow[key] = Math.round(modifiedRow[key] * variation * 100) / 100;
                    } else if (typeof modifiedRow[key] === 'string' && key.includes('ID')) {
                        // IDを変更
                        const idPrefix = modifiedRow[key].replace(/[0-9]/g, '');
                        const idNumber = parseInt(modifiedRow[key].replace(/[^0-9]/g, '') || 0) + 500 + i;
                        modifiedRow[key] = idPrefix + idNumber;
                    } else if (typeof modifiedRow[key] === 'string' && (key.includes('日') || key.includes('time') || key.includes('date') || key.includes('日時'))) {
                        // 日付を今年に更新（2024年に）
                        if (modifiedRow[key].match(/\d{4}-\d{2}-\d{2}/)) {
                            const dateParts = modifiedRow[key].split('-');
                            dateParts[0] = '2024';
                            modifiedRow[key] = dateParts.join('-');
                        }
                    }
                });
                
                expandedData.push(modifiedRow);
            }
        }
        
        let tableHtml = '<table>';
        
        // ヘッダー行
        tableHtml += '<tr>';
        columns.forEach(column => {
            tableHtml += `<th>${column}</th>`;
        });
        tableHtml += '</tr>';
        
        // データ行
        expandedData.forEach(row => {
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
    
    // ユースケースリストの作成（拡張版）
    const useCasesList = document.getElementById('use-cases-list');
    
    if (dataset.useCases && dataset.useCases.length > 0) {
        let useCasesHtml = '';
        
        // ユースケースごとに詳細説明を追加
        const useCaseDescriptions = {
            '顧客セグメント別の購買行動分析': '年齢や性別に基づく購買パターンの違いを分析し、ターゲット専用のマーケティング戦略策定に活用できます。当データセットを用いて顧客の年齢層、地域、購買履歴などに基づいてグループ化し、回帰分析やクラスタリング分析によりそれぞれのセグメントの購買傾向を明らかにします。',
            '商品カテゴリ間の関連性分析': '一緒に購入される商品の組み合わせを特定し、クロスセル戦略やレコメンデーションシステムの改善に活用可能です。アソシエーションルールマイニングや市場バスケット分析を実施し、関連性の高いカテゴリを発見します。',
            '顧客の生涯価値（LTV）予測': '顧客の過去の購買履歴から将来の購買行動を予測し、優良顧客の特定と維持戦略構築に役立ちます。生存分析やマルコフチェーンモデルを用いて履歴と将来の価値を絶えることで、ロイヤルティプログラムの最適化や離脱防止策を設計できます。',
            '予知保全分析による故障予測': '設備の状態データから故障の前兆を検知し、計画的な保守により稼働率を最大化できます。機械学習アルゴリズムを使用して、振動、温度、音響などのセンサーデータの変動パターンから故障発生前の異常値を検出できます。',
            '設備稼働率の最適化分析': '生産設備の稼働パターンを分析し、ボトルネックを特定して生産効率を向上させることが可能です。ラインバランシング手法や生産スケジューリングアルゴリズムを適用し、全体の生産ラインの最適化が可能です。',
            '疾患の早期発見アルゴリズムの開発': '患者データから疾患の早期兆候を検出し、予防医療や早期介入を実現するモデル構築に活用できます。ディープラーニングや時系列分析を使用して、検査値の微妙な変化から将来の疾患リスクを予測するモデルを開発します。',
            '治療効果の予測モデル構築': '患者の特性と治療結果の関係を分析し、個別化医療の実現に向けたエビデンス構築が可能です。ランダムフォレストや動的ベイズモデルなどの手法を用いて、特定の患者に最も効果的な治療法を予測します。',
            // 他のユースケースの詳細説明を追加
            '店舗別の売上パターン分析': '地域ごとの売上傾向や季節変動を分析し、地域特性に合わせた商品構成やマーケティング予算配分最適化が可能です。空間クラスタリング手法を用いて簡易商圏分析も行えます。',
            '季節ごとの需要変動予測': '年間の購買データから季節性やトレンドを分析し、将来の需要予測に基づいた在庫管理や発注計画を立案できます。時系列モデルやARIMA分析を用いて高精度な需要予測を行います。',
            '品質管理と不良率の相関分析': '生産パラメータと不良率の関係を分析し、品質向上に向けた重要ファクターを特定します。統計的品質管理（SQC）手法を用いてプロセス能力指数や管理図を求め、品質管理の最適化を行います。',
            '生産スケジュールの最適化': '生産ラインの効率と納期遵守率を最大化するスケジューリングモデルを構築できます。線形計画法や遺伝的アルゴリズムを用いて、複数の制約条件下での最適な生産計画を導き出します。',
            '設備投資の費用対効果分析': '設備投資による生産性向上と投資回収の観点から、最適な設備更新計画を策定できます。純現在価値（NPV）や内部収益率（IRR）などの指標を用いた投資評価モデルを構築します。',
            '医薬品の副作用パターン分析': '処方薬の組み合わせと副作用発生の関連性を分析し、リスクの高い薬剤の組み合わせを特定します。ベイジアンネットワークなどの確率モデルを用いて複雑な因果関係を解明します。',
            '疾患と生活習慣の相関研究': '患者の生活習慣データと疾患発症リスクの関連性を分析し、予防医療のエビデンス構築に活用できます。多変量解析や生存分析を用いてリスク要因の定量的評価を行います。',
            '患者フォローアップの最適化': '治療後の経過観察スケジュールを患者ごとにカスタマイズし、再発リスクに応じた最適なフォローアップ計画を策定できます。機械学習モデルを用いて患者ごとの再発リスクを予測します。'
        };

        dataset.useCases.forEach(useCase => {
            const description = useCaseDescriptions[useCase] || '様々な分析シナリオに応用可能なデータセットです。';
            useCasesHtml += `
                <li>
                    <span class="use-case-title">${useCase}</span>
                    <span class="use-case-desc">${description}</span>
                </li>
            `;
        });
        
        useCasesList.innerHTML = useCasesHtml;
    } else {
        useCasesList.innerHTML = '<li>ユースケースがありません。</li>';
    }
    
    // 基本グラフの作成
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
                        display: true,
                        text: '基本データ分析',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
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
            tabsHtml += `<button class="tab-button" data-tab="${tabId}">分析例 ${i+1}</button>`;
            
            // ユースケースごとのグラフコンテナを作成
            visualizationsHtml += `
                <div class="tab-pane" id="${tabId}-tab">
                    <div class="usecase-caption">この分析は以下のユースケースに対応: "${usecase}"</div>
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
