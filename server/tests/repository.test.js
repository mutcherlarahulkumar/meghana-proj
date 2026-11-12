jest.mock('../src/database/pool',()=>({execute:jest.fn()}));
const pool=require('../src/database/pool');
const repo=require('../src/database/goal.repository');
beforeEach(()=>jest.clearAllMocks());
test('uses bound parameters for lookup',async()=>{pool.execute.mockResolvedValue([[{id:1}]]);await repo.find('1 OR 1=1');expect(pool.execute).toHaveBeenCalledWith(expect.stringContaining('WHERE id = ?'),['1 OR 1=1']);});
test('maps API fields to database columns on create',async()=>{pool.execute.mockResolvedValueOnce([{insertId:7}]).mockResolvedValueOnce([[{id:7}]]);await repo.create({title:'Goal',description:'Why',category:'Learning',startDate:'2026-01-01',endDate:'2026-12-31',status:'pending'});expect(pool.execute.mock.calls[0][1]).toEqual(['Goal','Why','Learning','2026-01-01','2026-12-31','pending']);});
