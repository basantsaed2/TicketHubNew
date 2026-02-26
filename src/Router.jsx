import { createBrowserRouter, Outlet } from "react-router-dom";
import App from "./App";
import ProtectedLogin from "./ProtectedData/ProtectedRoute";
import LoginPage from "./Pages/Authentication/LoginPage";
import SignUpPage from "./Pages/Authentication/SignUpPage";
import { CheckoutPage, HomePage, SearchResultPage, ProfilePage, WalletPage, PointsPage, MyTripsPage, TripDetailsPage } from "./Pages/allPages";
import Suppert from "./Pages/Support";
import PrivacyPolicy from "./Pages/PrivacyPolicy";

export const router = createBrowserRouter(
  [
    {
      path: '',
      element: <App />,
      children: [
        // Authentication Routes
        {
          path: 'auth',
          element: <ProtectedLogin />,
          children: [
            {
              path: "login",
              element: <LoginPage />,
            },
            {
              path: "sign_up",
              element: <SignUpPage />,
            },
          ],
        },
        {
          path: "support",
          element: <Suppert />,
        },
        {
          path: "privacy_policy",
          element: <PrivacyPolicy />,
        },

        {
          path: '/',
          element: <HomePage />,
        },
        {
          path: "trips",
          element: <Outlet />,
          children: [
            {
              path: "",
              element: <SearchResultPage />,
            },
            {
              path: "details/:tripId",
              element: <TripDetailsPage />,
            },
          ]
        },
        {
          path: "checkout",
          element: <CheckoutPage />
        },
        {
          path: "profile",
          element: <ProfilePage />
        },
        {
          path: "wallet",
          element: <WalletPage />
        },
        {
          path: "points",
          element: <PointsPage />
        },
        {
          path: "my_trips",
          element: <MyTripsPage />
        }

      ],
    },
    // {
    //   path: '',
    //   element: <App />,
    //   children: [
    //     // Authentication
    //     {
    //       path: 'auth',
    //       element: <ProtectedLogin />,
    //       children: [{

    //         path: '',
    //         element: <AuthLayout />,
    //         children: [

    //           {
    //             path: 'login',
    //             element: <LoginPage />
    //           },
    //           {
    //             path: 'sign_up',
    //             element: <SignUpPage />
    //           },
    //         ],
    //       }
    //       ]
    //     },
    //     // {
    //     //   path: 'profile',
    //     //   // element: <ProfilePage />,
    //     //   element: <ProtectedLogin />,
    //     //   children: [
    //     //     {
    //     //       path: '',
    //     //       element: <ProfilePage />,

    //     //     }
    //     //   ]
    //     // },
    //   ],
    // },
    /* Catch-all for 404 */
    // {
    //   path: '*',
    //   element: <NotFoundPage />,
    // },
  ],
);
