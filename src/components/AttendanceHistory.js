import React from 'react';

const AttendanceHistory = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Attendance History</h2>
      <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Login Time</th>
            <th>Logout Time</th>
            <th>Email</th>
            <th>Total Hours Worked</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>--</td>
            <td>--</td>
            <td>--</td>
            <td>--</td>
            <td>--</td>
            <td>--</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceHistory;