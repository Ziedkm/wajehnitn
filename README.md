<div align="center">
  <img src="https://i.ibb.co/PzZftv9/wajehnitn-logo.png" alt="WajehniTN Logo" width="250"/>
  <h1>WajehniTN | دليلك للتوجيه الجامعي</h1>
  <p>
    An intuitive and visually appealing web application designed to help Tunisian Baccalaureate students discover their university orientation options by calculating their specific scores and recommending majors.
  </p>
  <p>
    <strong>Live Application:</strong> <a href="https://wajehnitn.vercel.app/"><strong>wajehnitn.vercel.app</strong></a>
  </p>
</div>

 
(*Note: You can replace this with a newer screenshot of your application*)

## ✨ Features

**WajehniTN** is built to provide a seamless and informative experience for students navigating the complex university orientation process.

- **Dynamic Score Calculation:** Automatically calculates the student's final orientation score (`Score Final`) for every university program based on their Baccalaureate type and individual subject grades.
- **Intelligent Recommendations:** Provides a ranked list of suitable university programs.
- **Advanced Filtering & Search:** Users can easily filter the results by:
    -   Field of Interest (e.g., Engineering, Health, Arts)
    -   University/Campus
    -   Free-text search by major, university name, or program code.
- **Interactive 3D Cards:** Results are displayed on beautiful, flippable cards.
    -   **Front:** Shows the major, university, the student's score vs. the required score, and a visual recommendation status (Highly Recommended, Possible, Not Recommended).
    -   **Back:** Flips to reveal detailed insights, including the score difference and the potential score with the 7% geographic bonus.
- **Special Requirements Display:** Clearly flags programs that have special conditions, such as entrance exams, gender restrictions, or age limits.
- **Dynamic Form Inputs:** The grade input form intelligently adapts to show only the relevant subjects for the selected Baccalaureate type, including optional languages.
- **Modern & Responsive UI:** A sleek, modern interface with a dark mode toggle, custom fonts, and a masonry layout that looks great on both desktop and mobile devices.
- **Monetization Ready:** Includes tastefully integrated ad slots for monetization via Google AdSense.

## 🛠️ Tech Stack

This project is built with a modern, performant, and scalable technology stack.

-   **Framework:** [Next.js](https://nextjs.org/) (React)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Animation:** [Framer Motion](https://www.framer.com/motion/)
-   **Deployment:** [Vercel](https://vercel.com/)

## 🚀 Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Ziedkm/wajehnitn.git
    cd wajehnitn
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of the project and add your Google AdSense IDs (optional, only needed for ad functionality).
    ```
    NEXT_PUBLIC_ADSENSE_PUB_ID=ca-pub-XXXXXXXXXXXXXXXX
    NEXT_PUBLIC_ADSENSE_SLOT_ID=YYYYYYYYYY
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📄 Data Source

All university orientation data, including scoring formulas, programs, and minimum required scores, was meticulously extracted from the official **"Dalil Tawjih Jami3i 2025"** PDF provided by the Tunisian Ministry of Higher Education and Scientific Research.

## ❤️ Credits & Acknowledgements

This project was conceived, designed, and developed by **Zied Kmanter**.

A special thanks to the AI assistant that helped in structuring the plan, extracting data, and debugging the code.

---

<div align="center">
  Made with ❤️ for all Tunisian students.
</div>
