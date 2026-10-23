// Hàm giả định của Service để test (Trong thực tế bạn sẽ import từ file service thật)
function kiemTraConBaoHanh(thietBi, ngayKiemTra) {
    if (!thietBi.ngayMua) return { conBaoHanh: null, lyDo: 'CHUA XAC MINH BAO HANH' };
    
    const ngayMua = new Date(thietBi.ngayMua);
    const ngayKT = new Date(ngayKiemTra);
    const thangChenhLech = (ngayKT.getFullYear() - ngayMua.getFullYear()) * 12 + (ngayKT.getMonth() - ngayMua.getMonth());
    
    return { conBaoHanh: thangChenhLech <= thietBi.soThangBaoHanh };
}

describe('kiemTraConBaoHanh - QT-05', () => {
    test('còn bảo hành khi chưa quá số tháng', () => {
        const tb = { ngayMua: '2026-01-15', soThangBaoHanh: 12 };
        const r = kiemTraConBaoHanh(tb, '2026-09-08');
        expect(r.conBaoHanh).toBe(true);
    });

    test('hết bảo hành khi đã quá số tháng', () => {
        const tb = { ngayMua: '2024-01-15', soThangBaoHanh: 12 };
        const r = kiemTraConBaoHanh(tb, '2026-09-08');
        expect(r.conBaoHanh).toBe(false);
    });

    // TEST QUAN TRỌNG NHẤT: Trường hợp biên
    test('chưa xác minh được khi không có ngày mua', () => {
        const tb = { ngayMua: null, soThangBaoHanh: 12 };
        const r = kiemTraConBaoHanh(tb, '2026-09-08');
        expect(r.conBaoHanh).toBeNull();
        expect(r.lyDo).toBe('CHUA XAC MINH BAO HANH');
    });
    
    test('hết bảo hành vừa tròn tháng', () => {
        const tb = { ngayMua: '2025-01-01', soThangBaoHanh: 12 };
        const r = kiemTraConBaoHanh(tb, '2026-02-01');
        expect(r.conBaoHanh).toBe(false);
    });

    test('còn bảo hành đúng ngày cuối cùng của tháng thứ 12', () => {
        const tb = { ngayMua: '2025-01-01', soThangBaoHanh: 12 };
        const r = kiemTraConBaoHanh(tb, '2026-01-31');
        expect(r.conBaoHanh).toBe(true);
    });
});