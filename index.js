// Get references to HTML elements

const contentDiv = document.getElementById("content");
// The main content area where pages are loaded

const adminBtn = document.getElementById("adminBtn");
// Button to show the admin dashboard

const userBtn = document.getElementById("userBtn");
// Button to show the user search page

// Retrieve problems data from localStorage or initialize an empty array

let problems = JSON.parse(localStorage.getItem("problems")) || [];
// Load from storage or create empty array

// Add event listeners to the navigation buttons

adminBtn.addEventListener("click", showAdminDashboard);
// When admin button is clicked, show the admin dashboard

userBtn.addEventListener("click", showUserSearch);
// When user button is clicked, show the user search page

// Function to display the admin dashboard

function showAdminDashboard() {
  // Set the content of the main div to the admin dashboard HTML
  contentDiv.innerHTML = `
        <h2>Admin Dashboard</h2>
        <form id="problemForm">
            <input type="text" id="bookName" placeholder="Book Name" required><br>
            <input type="number" id="chapterNumber" placeholder="Chapter Number" required><br>
            <input type="text" id="problemNumber" placeholder="Problem Number" required><br>
            <textarea id="problemStatement" placeholder="Problem Statement" required></textarea><br>
            <textarea id="solution" placeholder="Solution" required></textarea><br>
            <button class = "btn" id = "subbtn" type="submit">Add Problem</button>
        </form>
        <div id="problemList"></div> 
    `;

  // Get references to the form and the problem list div within the newly loaded HTML
  const problemForm = document.getElementById("problemForm");
  const problemList = document.getElementById("problemList");

  // Add event listener to the problem form for submission
  problemForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Prevent default form submission

    // Create a new problem object from the form values
    const newProblem = {
      bookName: document.getElementById("bookName").value,
      chapterNumber: document.getElementById("chapterNumber").value,
      problemNumber: document.getElementById("problemNumber").value,
      problemStatement: document.getElementById("problemStatement").value,
      solution: document.getElementById("solution").value,
    };

    // Add the new problem to the problems array
    problems.push(newProblem);

    // Save the updated problems array to localStorage
    localStorage.setItem("problems", JSON.stringify(problems));

    // Re-render the problem list to display the newly added problem
    renderProblemList();

    // Clear the form fields after submission
    problemForm.reset();
  });

  // Function to render the list of problems in the admin dashboard
  function renderProblemList() {
    problemList.innerHTML = "";
    // Clear the previous list

    // Iterate through the problems array and create a div for each problem
    problems.forEach((problem, index) => {
      const problemDiv = document.createElement("div");
      problemDiv.innerHTML = `
                <p>${problem.bookName} - Chapter ${problem.chapterNumber} - Problem ${problem.problemNumber}</p>
                <button class="delbtn btn" data-index="${index}">Delete</button>
            `;
      problemList.appendChild(problemDiv);

      // Add delete functionality to each problem div
      const deleteButton = problemDiv.querySelector(".delbtn");
      deleteButton.addEventListener("click", () => {
        const indexToDelete = parseInt(deleteButton.dataset.index);
        // Get the index of the problem to delete

        problems.splice(indexToDelete, 1);

        // Remove the problem from the array

        localStorage.setItem("problems", JSON.stringify(problems));

        // Update localStorage
        renderProblemList(); // Re-render the list after deletion
      });
    });
  }

  renderProblemList();
  // Initial render of the problem list when the admin dashboard is shown
}

// Function to display the user search page
function showUserSearch() {
  // Set the content of the main div to the user search page HTML
  contentDiv.innerHTML = `
        <h2>User Search</h2>
        <input type="text" id="searchInput" placeholder="Search Required Problem">
        <div id="search-page">
            <div id="left-sidebar"></div>
            <div id="center-section"></div>
            <div id="right-sidebar"></div>
        </div>
    `;

  // Get references to the search input and the sidebar divs
  const searchInput = document.getElementById("searchInput");
  const leftSidebar = document.getElementById("left-sidebar");
  const centerSection = document.getElementById("center-section");
  const rightSidebar = document.getElementById("right-sidebar");

  // Add event listener to the search input for changes
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    // Get the search term and convert it to lowercase

    const results = problems.filter((problem) => {
      // Filter the problems array based on the search term
      return problem.problemStatement.toLowerCase().includes(searchTerm); // Check if the problem statement includes the search term
    });

    displayResults(results);
    // Display the search results
  });

  // Function to display the search results in the sidebar and center section
  function displayResults(results) {
    leftSidebar.innerHTML = "";
    // Clear the left sidebar
    centerSection.innerHTML = "";
    // Clear the center section
    rightSidebar.innerHTML = "";
    // Clear the right sidebar

    if (results.length > 0) {
      // If there are search results
      const firstResult = results[0];
      // Get the first result to display initially

      // Display the book details in the right sidebar
      rightSidebar.innerHTML = `
                <h3>${firstResult.bookName}</h3>
                <p>Description: (Add description here)</p> <img src="book_image.jpg" alt="Book Cover" width="100">
            `;

      // Display the solution in the center section
      centerSection.innerHTML = `
                <h3>Solution</h3>
                <p>${firstResult.solution}</p>
            `;

      // Populate the left sidebar with chapters and related problems
      const chapters = {};
      // Object to store chapters and their related problems
      results.forEach((result) => {
        if (!chapters[result.chapterNumber]) {
          // If the chapter doesn't exist in the chapters object
          chapters[result.chapterNumber] = [];
          // Create a new array for that chapter
        }
        chapters[result.chapterNumber].push(result);
        // Add the problem to the corresponding chapter's array
      });

      // Iterate through the chapters and create a div for each chapter in the left sidebar
      for (const chapter in chapters) {
        const chapterDiv = document.createElement("div");
        chapterDiv.innerHTML = `<h4>Chapter ${chapter}</h4>`;
        chapters[chapter].forEach((problem) => {
          // Iterate through the problems in each chapter
          const problemLink = document.createElement("a"); // Create a link for each problem
          problemLink.href = "#";
          // You can add specific links if needed
          problemLink.textContent = `Problem ${problem.problemNumber}`; // Set the link text
          problemLink.addEventListener("click", () => {
            // Add event listener to the problem link
            // When a problem link is clicked, display the corresponding book details and solution
            rightSidebar.innerHTML = `
                            <h3>${problem.bookName}</h3>
                            <p>Description: (Add description here)</p><img src="book_image.jpg" alt="Book Cover" width="100">
                        `;
            centerSection.innerHTML = `
                            <h3>Solution</h3>
                            <p>${problem.solution}</p>
                        `;
          });
          chapterDiv.appendChild(document.createElement("br"));
          // Add a line break

          chapterDiv.appendChild(problemLink);
          // Add the problem link to the chapter div
        });
        leftSidebar.appendChild(chapterDiv);
        // Add the chapter div to the left sidebar
      }
    } else {
      centerSection.innerHTML = "<p>No results found.</p>";
      // Display a message if no results are found
    }
  }
}

// Show the user search page by default when the script loads
showUserSearch();
