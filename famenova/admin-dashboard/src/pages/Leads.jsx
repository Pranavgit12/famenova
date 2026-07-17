import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { leads } from '../services/api';
import LeadsTable from '../components/LeadsTable';
import LeadDetailModal from '../components/LeadDetailModal';

const PAGE_SIZE = 15;
const statuses = ['all', 'new', 'contacted', 'qualified', 'closed', 'lost'];

export default function Leads() {
  const [leadsList, setLeadsList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: PAGE_SIZE,
        sort: `${sortDir === 'desc' ? '-' : ''}${sortField}`,
      };
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await leads.getAll(params);
      const data = res.data;
      setLeadsList(data.leads || data.data || data || []);
      setTotal(data.total || data.count || 0);
    } catch {
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, sortField, sortDir]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const handleUpdate = (updated) => {
    setLeadsList((prev) =>
      prev.map((l) => ((l._id || l.id) === (updated._id || updated.id) ? updated : l))
    );
    fetchLeads();
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="table-toolbar">
          <div className="search-input">
            <span className="search-input-icon">⌕</span>
            <input
              type="text"
              placeholder="Search leads by name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="tabs">
            {statuses.map((s) => (
              <button
                key={s}
                className={`tab ${statusFilter === s ? 'active' : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner" />
          </div>
        ) : (
          <>
            <LeadsTable
              leads={leadsList}
              onRowClick={setSelected}
              sortField={sortField}
              sortDir={sortDir}
              onSort={handleSort}
            />
            {leadsList.length > 0 && (
              <div className="pagination">
                <div className="pagination-info">
                  Showing {(page - 1) * PAGE_SIZE + 1}–
                  {Math.min(page * PAGE_SIZE, total)} of {total}
                </div>
                <div className="pagination-controls">
                  <button
                    className="pagination-btn"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    ‹ Prev
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let p;
                    if (totalPages <= 5) {
                      p = i + 1;
                    } else if (page <= 3) {
                      p = i + 1;
                    } else if (page >= totalPages - 2) {
                      p = totalPages - 4 + i;
                    } else {
                      p = page - 2 + i;
                    }
                    return (
                      <button
                        key={p}
                        className={`pagination-btn ${p === page ? 'active' : ''}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    className="pagination-btn"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next ›
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {!loading && leadsList.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-title">No leads found</div>
            <div className="empty-state-text">
              {search || statusFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Leads will appear here once submitted through your contact forms.'}
            </div>
          </div>
        )}
      </div>

      {selected && (
        <LeadDetailModal
          lead={selected}
          onClose={() => setSelected(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
