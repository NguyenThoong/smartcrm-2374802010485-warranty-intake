const { createNewTicket } = require('../services/ticketService');
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