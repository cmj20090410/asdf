// 등록 기능 처리
if (document.getElementById('itemForm')) {
    document.getElementById('itemForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const reader = new FileReader();
        const file = document.getElementById('photo').files[0];

        reader.onloadend = function () {
            const item = {
                name: document.getElementById('itemName').value,
                location: document.getElementById('location').value,
                date: document.getElementById('lostDate').value,
                reporter: document.getElementById('reporter').value,
                photo: reader.result,            // base64 인코딩 이미지
                found: false,                    // 처음엔 주인 못 찾음
                timestamp: new Date().getTime()  // 현재 시간 저장
            };

            let items = JSON.parse(localStorage.getItem('items') || '[]');
            items.push(item);
            localStorage.setItem('items', JSON.stringify(items));

            alert('등록 완료!');
            window.location.href = 'index.html';
        };

        if (file) {
            reader.readAsDataURL(file);
        } else {
            alert("사진을 선택해주세요.");
        }
    });
}

// 페이지 로드시 목록 표시 + 오래된 항목 자동 삭제
window.onload = function () {
    if (!document.getElementById('itemList')) return;

    let items = JSON.parse(localStorage.getItem('items') || '[]');
    const now = new Date().getTime();
    const oneMonth = 30 * 24 * 60 * 60 * 1000;

    // 조건: 주인을 찾았고 등록일로부터 한 달 지난 경우 삭제
    items = items.filter(item => {
        const age = now - item.timestamp;
        return !(item.found && age > oneMonth);
    });

    localStorage.setItem('items', JSON.stringify(items));
    displayItems(items);
};

// 카드 목록 표시
function displayItems(items) {
    const container = document.getElementById('itemList');
    container.innerHTML = '';
    items.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'item-card';

        card.innerHTML = `
            <div class="image-wrapper">
                <img src="${item.photo}" alt="분실물 사진">
                ${item.found ? `<div class="found-banner">✅ 주인을 찾았습니다</div>` : ''}
            </div>
            <h3>${item.name}</h3>
            <p><strong>위치:</strong> ${item.location}</p>
            <p><strong>날짜:</strong> ${item.date}</p>
            <p><strong>신고자:</strong> ${item.reporter}</p>
            ${!item.found ? `<button class="mark-btn" onclick="markAsFound(${index})">✅ 주인을 찾았어요</button>` : ''}
            <button class="delete-btn" onclick="deleteItem(${index})">🗑 삭제</button>
        `;

        container.appendChild(card);
    });
}

// 주인 찾음 표시 처리
function markAsFound(index) {
    let items = JSON.parse(localStorage.getItem('items') || '[]');
    items[index].found = true;
    localStorage.setItem('items', JSON.stringify(items));
    displayItems(items);
}

// 삭제 처리
function deleteItem(index) {
    if (confirm("이 게시물을 삭제하시겠습니까?")) {
        let items = JSON.parse(localStorage.getItem('items') || '[]');
        items.splice(index, 1);
        localStorage.setItem('items', JSON.stringify(items));
        displayItems(items);
    }
}

// 검색 기능
function searchItems() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    const items = JSON.parse(localStorage.getItem('items') || '[]');
    const filtered = items.filter(item =>
        item.name.toLowerCase().includes(keyword) ||
        item.location.toLowerCase().includes(keyword)
    );
    displayItems(filtered);
}