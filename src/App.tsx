import Campaign from 'pages/campaign/Campaign';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import './global.scss';

export default function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Campaign />,
    }
  ]);
  return <RouterProvider router={router} />;
}
