document.addEventListener("DOMContentLoaded", () => {
    const dashboardContent = document.getElementById('dashboard-content');

    const rooms = Array.from({ length: 20 }, (_, i) => ({
        roomNumber: 100 + i + 1,
        status: 'available',
        patientDetails: null
    }));

    function loadContent(content) {
       
        const contentSections = document.querySelectorAll('.dashboard-content');
        contentSections.forEach(section => section.classList.remove('active'));

        dashboardContent.innerHTML = content;
        dashboardContent.classList.add('active');
    }

    const patientManagementContent = `
        <div class="dashboard-container">
            <h1>Hospital Room Booking Dashboard</h1>
            <div class="room-stats">
                <p>Total Rooms: <span id="total-rooms">0</span></p>
                <p>Booked Rooms: <span id="booked-rooms">0</span></p>
                <p>Available Rooms: <span id="available-rooms">0</span></p>
            </div>
            <div id="rooms-grid" class="rooms-grid"></div>
        </div>

        <!-- Form container for booking a room -->
        <div id="form-container" class="form-container hidden">
            <h2>Patient Details for Room <span id="selected-room"></span></h2>
            <form id="patient-form">
                <label for="patient-name">Patient Name:</label>
                <input type="text" id="patient-name" required>
                <label for="patient-age">Patient Age:</label>
                <input type="number" id="patient-age" required>
                <label for="mobile-number">Mobile Number:</label>
                <input type="tel" id="mobile-number" required pattern="[0-9]{10}">
                <button type="submit" class="book-btn">Book Room</button>
            </form>
        </div>

        <!-- Form container for vacating a room -->
        <div id="vacate-container" class="form-container hidden">
            <h2>Vacate Room <span id="vacate-room"></span></h2>
            <p>Are you sure you want to vacate this room?</p>
            <button id="vacate-btn" class="book-btn">Yes, Vacate Room</button>
        </div>
    `;

    const appointmentSchedulingContent = `
        <div class="dashboard-container">
            <h1>Appointment Scheduling</h1>
            <div class="appointment-form">
                <h2>Schedule a New Appointment</h2>
                <form id="appointment-form">
                    <label for="patient-name">Patient Name:</label>
                    <input type="text" id="patient-name" required>
                    
                    <label for="appointment-date">Appointment Date:</label>
                    <input type="date" id="appointment-date" required>
                    
                    <label for="appointment-time">Appointment Time:</label>
                    <input type="time" id="appointment-time" required>
                    
                    <label for="doctor-name">Doctor:</label>
                    <input type="text" id="doctor-name" required>
                    
                    <button type="submit" class="submit-btn">Schedule Appointment</button>
                </form>
            </div>
            <div class="appointment-list">
                <h2>Upcoming Appointments</h2>
                <ul id="appointment-list">
                    <!-- Appointment items will be dynamically added here -->
                </ul>
            </div>
        </div>
    `;

    const billingManagementContent = `
        <div class="dashboard-container">
            <h1>Billing and Payment Management</h1>
            <div class="billing-form">
                <h2>Process Payment</h2>
                <form id="billing-form">
                    <label for="patient-id">Patient ID:</label>
                    <input type="text" id="patient-id" required>
                    <label for="amount">Amount:</label>
                    <input type="number" id="amount" required>
                    <label for="payment-method">Payment Method:</label>
                    <select id="payment-method" required>
                        <option value="">Select a payment method</option>
                        <option value="credit-card">Credit Card</option>
                        <option value="debit-card">Debit Card</option>
                        <option value="cash">Cash</option>
                    </select>
                    <button type="submit" class="submit-btn">Process Payment</button>
                </form>
            </div>
            <div class="billing-list">
                <h2>Billing Records</h2>
                <ul id="billing-records">
                    <!-- Billing records will be dynamically added here -->
                </ul>
            </div>
        </div>
    `;

    function initializeRoomBooking() {
        const roomsGrid = document.getElementById('rooms-grid');
        const formContainer = document.getElementById('form-container');
        const vacateContainer = document.getElementById('vacate-container');
        const totalRoomsSpan = document.getElementById('total-rooms');
        const bookedRoomsSpan = document.getElementById('booked-rooms');
        const availableRoomsSpan = document.getElementById('available-rooms');
        const patientForm = document.getElementById('patient-form');
        const vacateBtn = document.getElementById('vacate-btn');
        const selectedRoomSpan = document.getElementById('selected-room');
        const vacateRoomSpan = document.getElementById('vacate-room');

        function updateRoomGrid() {
            roomsGrid.innerHTML = '';
            rooms.forEach(room => {
                const roomBox = document.createElement('div');
                roomBox.className = `room-box ${room.status}`;
                roomBox.innerHTML = `Room ${room.roomNumber}`;
                roomBox.addEventListener('click', () => {
                    if (room.status === 'available') {
                        selectedRoomSpan.textContent = room.roomNumber;
                        formContainer.classList.remove('hidden');
                    } else {
                        vacateRoomSpan.textContent = room.roomNumber;
                        vacateContainer.classList.remove('hidden');
                    }
                });
                roomsGrid.appendChild(roomBox);
            });

            totalRoomsSpan.textContent = rooms.length;
            bookedRoomsSpan.textContent = rooms.filter(room => room.status === 'booked').length;
            availableRoomsSpan.textContent = rooms.filter(room => room.status === 'available').length;
        }

        patientForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const patientName = document.getElementById('patient-name').value;
            const patientAge = document.getElementById('patient-age').value;
            const mobileNumber = document.getElementById('mobile-number').value;
            const roomNumber = selectedRoomSpan.textContent;

   
            const room = rooms.find(r => r.roomNumber == roomNumber);
            if (room) {
                room.status = 'booked';
                room.patientDetails = {
                    name: patientName,
                    age: patientAge,
                    mobile: mobileNumber
                };
                alert(`Room ${roomNumber} has been booked for ${patientName}.`);
                formContainer.classList.add('hidden');
                updateRoomGrid();
            }
        });

        vacateBtn.addEventListener('click', () => {
            const roomNumber = vacateRoomSpan.textContent;
            const room = rooms.find(r => r.roomNumber == roomNumber);
            if (room) {
                room.status = 'available';
                room.patientDetails = null;
                alert(`Room ${roomNumber} has been vacated.`);
                vacateContainer.classList.add('hidden');
                updateRoomGrid();
            }
        });

        updateRoomGrid();
    }

    function initializeAppointmentScheduling() {
        const appointmentForm = document.getElementById('appointment-form');
        const appointmentList = document.getElementById('appointment-list');
        const appointments = [];

        appointmentForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const patientName = document.getElementById('patient-name').value;
            const appointmentDate = document.getElementById('appointment-date').value;
            const appointmentTime = document.getElementById('appointment-time').value;
            const doctorName = document.getElementById('doctor-name').value;

            const appointment = {
                patientName,
                date: appointmentDate,
                time: appointmentTime,
                doctorName
            };
            appointments.push(appointment);

    
            const listItem = document.createElement('li');
            listItem.textContent = `${patientName} - ${appointmentDate} at ${appointmentTime} with Dr. ${doctorName}`;
            appointmentList.appendChild(listItem);

            alert(`Appointment scheduled for ${patientName} on ${appointmentDate} at ${appointmentTime}.`);
            appointmentForm.reset();
        });
    }


    function initializeBillingManagement() {
        const billingForm = document.getElementById('billing-form');
        const billingRecords = document.getElementById('billing-records');
        const records = [];

        billingForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const patientId = document.getElementById('patient-id').value;
            const amount = document.getElementById('amount').value;
            const paymentMethod = document.getElementById('payment-method').value;

            const record = {
                patientId,
                amount,
                paymentMethod,
                date: new Date().toLocaleDateString()
            };
            records.push(record);
            const listItem = document.createElement('li');
            listItem.textContent = `Patient ID: ${patientId}, Amount: ${amount}, Payment Method: ${paymentMethod}, Date: ${record.date}`;
            billingRecords.appendChild(listItem);

            alert(`Payment processed for Patient ID: ${patientId}.`);
            billingForm.reset();
        });
    }



    document.getElementById('patient-management-nav').addEventListener('click', (event) => {
        event.preventDefault();
        loadContent(patientManagementContent);
        initializeRoomBooking();
    });

    document.getElementById('appointment-scheduling-nav').addEventListener('click', (event) => {
        event.preventDefault();
        loadContent(appointmentSchedulingContent);
        initializeAppointmentScheduling();
    });

    document.getElementById('billing-management-nav').addEventListener('click', (event) => {
        event.preventDefault();
        loadContent(billingManagementContent);
        initializeBillingManagement();
    });

});
