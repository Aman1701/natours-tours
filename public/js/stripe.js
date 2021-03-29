import axios from "axios";
import { showAlert } from "./alerts";

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    "pk_test_51Ia5YiSE1lMGfbIZP4FklfQB0fkgRquHa9sKG1vRldNy7R0jXexHhiDnKpoo5ROjc5g5w2adhk1SgG2bW6i1qbEK00IIGWOlLT"
  );
  try {
    //1) get check out session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/booking/checkout-session/${tourId}`
    );
    //2) Create checkout form + charge the credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert("error", err);
  }
};
