const { createNewTicket, getTicketById, updateTicket, deleteTicket } = require('../services/ticketService');
const ticketRepo = require('../repositories/ticketRepository');

// Giả lập (Mock) ticketRepository để không gọi trực tiếp xuống Database thật
jest.mock('../repositories/ticketRepository');

describe('Ticket Service - createNewTicket', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Xóa lịch sử gọi hàm trước mỗi test
    });

    // 1. LUỒNG ĐÚNG (Happy Path)
    test('1. Tạo phiếu thành công với trạng thái TIEP_NHAN', async () => {
        const mockData = {
            customer_id: 101,
            device_id: 1,
            issue_desc: 'Màn hình bị sọc đen mờ',
            priority: 'CAO'
        };
        
        // Giả lập DB trả về thành công
        ticketRepo.createTicket.mockResolvedValue({ 
            ticket_id: 1, 
            ...mockData, 
            status: 'TIEP_NHAN' 
        });

        const result = await createNewTicket(mockData);

        expect(ticketRepo.createTicket).toHaveBeenCalled();
        expect(result.status).toBe('TIEP_NHAN');
        expect(result.priority).toBe('CAO');
    });

    // 2. LUỒNG BIÊN (Boundary)
    test('2. Tự động nối chuỗi cảnh báo nếu mô tả dưới 10 ký tự', async () => {
        const mockData = {
            customer_id: 102,
            device_id: 2,
            issue_desc: 'Lỗi pin', // Chỉ có 7 ký tự (< 10)
            priority: 'TRUNG_BINH'
        };
        
        // Cho phép mock trả về đúng data truyền vào để kiểm tra logic xử lý chuỗi
        ticketRepo.createTicket.mockImplementation(async (data) => data);

        const result = await createNewTicket(mockData);

        expect(result.issue_desc).toBe('Sự cố thiết bị: Lỗi pin (Cần kiểm tra kỹ)');
    });

    // 3. DỮ LIỆU SAI (Error/Invalid)
    test('3. Báo lỗi và từ chối tạo phiếu khi database bắt lỗi null constraint', async () => {
        const mockData = {
            // Cố tình gửi thiếu dữ liệu bắt buộc (customer_id)
            issue_desc: 'Không lên nguồn'
        };
        
        // Giả lập DB quăng lỗi do thiếu khóa ngoại
        const dbError = new Error('null value in column "customer_id" violates not-null constraint');
        ticketRepo.createTicket.mockRejectedValue(dbError);

        // Kiểm tra xem hàm có ném ra lỗi đúng như kỳ vọng không
        await expect(createNewTicket(mockData)).rejects.toThrow('null value in column "customer_id"');
    });
});

describe('Ticket Service - Read, Update, Delete (CRUD)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('4. Xem chi tiết phiếu (Read) kèm danh sách nhật ký trạng thái', async () => {
        ticketRepo.getTicketById.mockResolvedValue({
            ticket_id: 10,
            ticket_code: 'TK-123456',
            status: 'TIEP_NHAN'
        });
        ticketRepo.getStatusLogsByTicketId.mockResolvedValue([
            { log_id: 1, from_status: null, to_status: 'TIEP_NHAN', changed_by: 'Tiếp tân' }
        ]);

        const detail = await getTicketById(10);
        expect(detail).toBeDefined();
        expect(detail.ticket_code).toBe('TK-123456');
        expect(detail.logs.length).toBe(1);
    });

    test('5. Cập nhật phiếu thành công và ghi nhận nhật ký (Update Happy Path)', async () => {
        ticketRepo.getTicketById.mockResolvedValue({
            ticket_id: 10,
            ticket_code: 'TK-123456',
            status: 'TIEP_NHAN',
            priority: 'TRUNG_BINH',
            issue_desc: 'Màn hình bị sọc dọc xanh'
        });
        ticketRepo.updateTicket.mockResolvedValue({
            ticket_id: 10,
            status: 'DANG_SUA',
            priority: 'CAO',
            issue_desc: 'Màn hình bị sọc dọc xanh và chớp nháy'
        });

        const updated = await updateTicket(10, {
            status: 'DANG_SUA',
            priority: 'CAO',
            issue_desc: 'Màn hình bị sọc dọc xanh và chớp nháy',
            changed_by: 'Kỹ thuật viên L2'
        });

        expect(ticketRepo.updateTicket).toHaveBeenCalled();
        expect(ticketRepo.addStatusLog).toHaveBeenCalledWith(10, 'TIEP_NHAN', 'DANG_SUA', 'Kỹ thuật viên L2');
        expect(updated.status).toBe('DANG_SUA');
    });

    test('6. Từ chối cập nhật khi mô tả sự cố dưới 10 ký tự (Update Boundary Error)', async () => {
        ticketRepo.getTicketById.mockResolvedValue({
            ticket_id: 10,
            issue_desc: 'Màn hình bị hỏng'
        });

        await expect(updateTicket(10, { issue_desc: 'Hỏng loa' })).rejects.toThrow('10 ký tự');
    });

    test('7. Từ chối cập nhật khi trạng thái không nằm trong danh mục cho phép', async () => {
        ticketRepo.getTicketById.mockResolvedValue({
            ticket_id: 10,
            status: 'TIEP_NHAN'
        });

        await expect(updateTicket(10, { status: 'TRANG_THAI_KHONG_HOP_LE' })).rejects.toThrow('Trạng thái không hợp lệ');
    });

    test('8. Xóa phiếu thành công (Delete)', async () => {
        ticketRepo.getTicketById.mockResolvedValue({ ticket_id: 10, ticket_code: 'TK-123456' });
        ticketRepo.deleteTicket.mockResolvedValue({ ticket_id: 10, ticket_code: 'TK-123456' });

        const deleted = await deleteTicket(10);
        expect(ticketRepo.deleteTicket).toHaveBeenCalledWith(10);
        expect(deleted.ticket_code).toBe('TK-123456');
    });
});
