document.addEventListener("DOMContentLoaded", async () => { // Change to async function
    const form = document.getElementById("appointmentForm");
    const successMessage = document.getElementById("successMessage");
    const errorMessage = document.getElementById("errorMessage");
    const doctorSelect = form.doctorUsername; // Get the doctor select element

    try {
        // Fetch doctors from the API using await
        const response = await fetch('/getdoctors', {
            method: 'GET', // Specify the GET method
            headers: {
                'Content-Type': 'application/json', // Set Content-Type header
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const doctors = await response.json();

        // Clear existing options
        doctorSelect.innerHTML = '<option value="">Choose Doctor</option>';
        
        // Populate the dropdown with doctor usernames
        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.userName; // Use userName field
            option.textContent = doctor.userName; // Displayed text
            doctorSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        // Optionally, you can display an error message to the user here
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent form from submitting normally

        // Gather form data
        const formData = {
            doctorUsername: form.doctorUsername.value,
            appointmentDate: form.appointmentDate.value,
            appointmentTime: form.appointmentTime.value,
            problemDescription: form.problemDescription.value,
        };

        try {
            // Send a POST request to the backend
            const response = await fetch('/bookappointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            // Check if the response is OK
            if (response.ok) {
                // Show success message
                successMessage.style.display = "block";
                errorMessage.style.display = "none";
                form.reset(); // Reset the form
            } else {
                throw new Error("Failed to book the appointment.");
            }
        } catch (error) {
            console.error("Error booking appointment:", error);
            errorMessage.style.display = "block";
            successMessage.style.display = "none";
        }
    });
});
