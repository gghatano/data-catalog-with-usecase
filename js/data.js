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
            const dataId = parseInt(this.getAttribute('data-id'));
            showDataDetail(dataId);
        });
    });
}

// キーワードとタグによるフィルタリング
function filterData(keyword, tag) {
    let filteredData = [...datasets];
    
    // キーワードフィルタリング
    if (keyword && keyword.trim() !== '') {
        const normalizedKeyword = keyword.toLowerCase().trim();
        
        filteredData = filteredData.filter(dataset => {
            // 名前、説明、タグ、データ所有者でマッチするか確認
            return (
                dataset.name.toLowerCase().includes(normalizedKeyword) ||
                dataset.description.toLowerCase().includes(normalizedKeyword) ||
                dataset.dataOwner.toLowerCase().includes(normalizedKeyword) ||
                (dataset.tags && dataset.tags.some(t => t.toLowerCase().includes(normalizedKeyword)))
            );
        });
    }
    
    // タグフィルタリング
    if (tag && tag !== '全て') {
        filteredData = filteredData.filter(dataset => {
            return dataset.tags && dataset.tags.some(t => t === tag);
        });
    }
    
    displayDataList(filteredData);
}
