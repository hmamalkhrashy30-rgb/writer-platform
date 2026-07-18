@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  direction: rtl;
  font-family: 'Cairo', sans-serif;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
