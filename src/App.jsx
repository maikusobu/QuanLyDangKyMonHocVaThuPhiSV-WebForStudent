import { useState, useEffect } from 'react';
import './App.css';
import Valid from 'card-validator';
import Head from './Head';
import {getTermYear, resolveTerm} from "./util.js";
import Form from './Form';
import FormThankYou from './FormThankYou';
import User from "./User";
import useAuth from './useAuth';
import axiosClient from "./api/axiosClient.js";
import {useNavigate} from "react-router-dom";
import Loading from "./Loading";
import axios from "axios";
function App() {
  const [formData, setFormData] = useState({
    cardNumber: '',
    month: '',
    year: '',
    cvc: '',
    amount: 0,
    name: ''
  });

  const [formErrors, setFormErrors] = useState({
    cardNumber: '',
    month: '',
    year: '',
    cvc: '',
    amount: '',
    name: ''
  });

  const [formattedCardNumber, setFormattedCardNumber] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [tuitionId, setTuitionId] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const {id, isLoaded, handleLoaded } = useAuth();
const termYear = getTermYear();

  useEffect(() => {
    setFormattedCardNumber(prevFormat => {
      return formData.cardNumber.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
    });
  }, [formData.cardNumber]);
  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        const response = await axiosClient.get(`/student/${id}`);
        const responseTuition = await axiosClient.get(`/payment/mine?term=${resolveTerm(termYear.term)}&year=${termYear.year}&studentId=${id}`);
        const user_created = {
          ...response.data,
          tuition: responseTuition.data
        }

        if (isMounted) {
          setUser(user_created);
          localStorage.setItem("tuitionId", JSON.stringify(responseTuition.data?.id || ""));
        }
      } catch (error) {
        console.log(error)
        // navigate("/login")
      }
    };
    fetchUser().then(r => handleLoaded(true));
    return () => {
      isMounted = false;
    };
  }, [id]);
  const containsOnlyNumbers = (str) => {
    const removedSpaces = str.replace(/\s/g, '');
    return /^\d+$/.test(removedSpaces);
  };

  const validate = (values) => {
    const errors = {};
    const regexCardNumber = containsOnlyNumbers(values.cardNumber);
    const regexMonth = containsOnlyNumbers(values.month);
    const regexYear = containsOnlyNumbers(values.year);
    const regexCvc = containsOnlyNumbers(values.cvc);
    const isNumberLargeThanZero = values.amount > 0;
    const currentYear = new Date().getFullYear();
    const lastTwoDigitsOfYear = currentYear.toString().slice(-2);

    if (!values.name) {
      errors.name = "Tên không được để trống";
    }
    if (!values.cardNumber) {
      errors.cardNumber = "Số thẻ không được để trống";
    } else if (!regexCardNumber) {
      errors.cardNumber = "Sai định dạng, chỉ chứa số";
    }
    if (!values.month) {
      errors.month = "Tháng không được để trống";
    } else if (!regexMonth) {
      errors.month = "Sai định dạng, chỉ chứa số";
    } else if (values.month > 12) {
      errors.month = "Tháng phải nhỏ hơn hoặc bằng 12";
    }
    if (!values.year) {
      errors.year = "Không được để trống năm";
    } else if (!regexYear) {
      errors.year = "Sai định dạng, chỉ chứa số";
    } else if (values.year < lastTwoDigitsOfYear) {
      errors.year = "Năm phải lớn hơn hoặc bằng năm hiện tại";
    }
    if (!values.cvc) {
      errors.cvc = "Không được để trống cvc";
    } else if (!regexCvc) {
      errors.cvc = " Sai định dạng, chỉ chứa số";
    }
    if (!isNumberLargeThanZero) {
      errors.amount = "Không được thanh toán số tiền nhỏ hơn 0";
    }
    if (user.tuition) {
        if (values.amount > user.tuition.totalActual - user.tuition.totalPaid) {
            errors.amount = "Số tiền thanh toán không được lớn hơn số tiền còn nợ";
        }
    } else {
        errors.amount = "Không có thông tin học phí";
    }
    if (Valid.number(values.cardNumber).isValid === false && Valid.number(values.cardNumber).isPotentiallyValid === false) {
      errors.cardNumber = "Số thẻ không hợp lệ";
    }
    return errors;
  };

  const noErrors = Object.keys(formErrors).length === 0;
  console.log(tuitionId)
  const handleInput = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = (name === 'amount' && (value === undefined || value === null || value === '')) ? 0 : value;

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: sanitizedValue
    }));

    setFormErrors({
      cardNumber: '',
      month: '',
      year: '',
      cvc: '',
      amount: '',
      name: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors(validate(formData));

    await axiosClient.post("payment", {
      tuitionId: localStorage.getItem("tuitionId"),
      amount: formData.amount,
    })
    setFormSubmitted(true);
  };
  if (!isLoaded) {
    return <Loading />;
  }

  return (
      <div className="App h-full w-full flex flex-col items-center lg:flex-row">
        <Head
            formattedCardNumber={formattedCardNumber}
            formData={formData}
        />
        <User user={user}/>
        { !noErrors || !formSubmitted ?
            <Form
                formSubmitted={formSubmitted}
                handleSubmit={handleSubmit}
                formattedCardNumber={formattedCardNumber}
                formData={formData}
                handleInput={handleInput}
                formErrors={formErrors}
            />
            :
            <FormThankYou />
        }
      </div>
  );
}

export default App;
