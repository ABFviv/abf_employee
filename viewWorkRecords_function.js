// View Work Records Function - Insert this into employees.html

async function viewWorkRecords(employeeId) {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) {
        showNotification('کارمەند نەدۆزرایەوە', 'danger');
        return;
    }

    // Load work records from subcollection
    const workRecords = await loadEmployeeWorkRecords(employeeId);
    
    // Separate daily and other work
    const dailyWork = workRecords.daily || [];
    const otherWork = workRecords.other || [];

    // Create modal content
    let modalContent = `
        <div class="modal fade" id="workRecordsModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">تۆماری کارەکانی ${employee.name} (${employee.id})</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <ul class="nav nav-tabs mb-3" role="tablist">
                            <li class="nav-item">
                                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#dailyWorkTab">
                                    کاری ڕۆژانە (${dailyWork.length})
                                </button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#otherWorkTab">
                                    کارەکانی دیکە (${otherWork.length})
                                </button>
                            </li>
                        </ul>
                        
                        <div class="tab-content">
                            <!-- Daily Work Tab -->
                            <div class="tab-pane fade show active" id="dailyWorkTab">
                                ${dailyWork.length === 0 ? '<p class="text-center text-muted">هیچ تۆمارێک نییە</p>' : `
                                    <div class="table-responsive">
                                        <table class="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>بەروار</th>
                                                    <th>ناو</th>
                                                    <th>هەڵسەنگاندن</th>
                                                    <th>تێبینی</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${dailyWork.map(record => `
                                                    <tr>
                                                        <td>${record.date || 'N/A'}</td>
                                                        <td>${record.name || record.carts || 'N/A'}</td>
                                                        <td><span class="badge ${record.rate >= 0 ? 'bg-success' : 'bg-danger'}">${record.rate || 0}</span></td>
                                                        <td>${record.note || '-'}</td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                `}
                            </div>
                            
                            <!-- Other Work Tab -->
                            <div class="tab-pane fade" id="otherWorkTab">
                                ${otherWork.length === 0 ? '<p class="text-center text-muted">هیچ تۆمارێک نییە</p>' : `
                                    <div class="table-responsive">
                                        <table class="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>بەروار</th>
                                                    <th>ناو</th>
                                                    <th>هەڵسەنگاندن</th>
                                                    <th>تێبینی</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${otherWork.map(record => `
                                                    <tr>
                                                        <td>${record.date || 'N/A'}</td>
                                                        <td>${record.name || 'N/A'}</td>
                                                        <td><span class="badge ${record.rate >= 0 ? 'bg-success' : 'bg-danger'}">${record.rate || 0}</span></td>
                                                        <td>${record.note || '-'}</td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">داخستن</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('workRecordsModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalContent);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('workRecordsModal'));
    modal.show();

    // Clean up when modal is hidden
    document.getElementById('workRecordsModal').addEventListener('hidden.bs.modal', function () {
        this.remove();
    });
}
