// グローバル変数 
let datasets = [];
let activeTag = '全て'; // アクティブなフィルタータグ

// DOM要素が読み込まれたら実行
document.addEventListener('DOMContentLoaded', function() {
    // データを読み込む
    fetchData();

    // 検索機能の設定
    document.getElementById('search-input').addEventListener('input', function() {
        filterData(this.value, activeTag);
    });

    // タグフィルターの設定
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const tagValue = this.getAttribute('data-tag');
            // アクティブクラスを切り替え
            document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            activeTag = tagValue;
            filterData(document.getElementById('search-input').value, activeTag);
        });
    });
    // 初期化時に「全て」をアクティブに
    document.querySelector('.filter-tag[data-tag="全て"]').classList.add('active');

    // 戻るボタンの設定
    document.getElementById('back-button').addEventListener('click', function() {
        showDataList();
    });

    // 申請ボタンの設定
    document.getElementById('apply-button').addEventListener('click', function() {
        alert('利用申請フォームへの遷移をシミュレートしています。実際のアプリケーションでは申請フォームに遷移します。');
    });
});
