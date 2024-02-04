import React, { useEffect, useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { v4 as uuidv4 } from 'uuid';

function TableForm({ description, setDescription, quantity, setQuantity, price, setPrice, amount, setAmount, list, setList, total, setTotal }) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedGSTRate, setSelectedGSTRate] = useState(0.18); // Default GST rate is 18%
  const [gstRates] = useState([0.05, 0.12, 0.18, 0.28]); // Different GST rates to choose from
  const [cgst, setCgst] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [amount1, setamount1] = useState('');



  const handleSubmit1 = (e) => {
    e.preventDefault();
    if (amount1 === "") {
      alert("Please enter amount");
    } else {
      const amountInPaise = Math.round(parseFloat(amount1) * 100); // Convert amount to integer paise
      if (amountInPaise < 100) {
        alert("Minimum amount is 1 rupee (100 paise)");
      } else {
        var options = {
          key: "rzp_test_1ZSK2DBuI7hYIS",
          key_secret: "fIV4YZG00GtLqIezIApHAIY3",
          amount: amountInPaise,
          currency: "INR",
          name: "STARTUP_PROJECTS",
          description: "for testing purpose",
          handler: function (response) {
            alert(response.razorpay_payment_id);
          },
          prefill: {
            name: "sudharsan",
            email: "sudharsan.kannan01@gmail.com",
            contact: "7448881271",
          },
          notes: {
            address: "Razorpay Corporate office",
          },
          theme: {
            color: "#3399cc",
          },
        };
        var pay = new window.Razorpay(options);
        pay.open();
      }
    }
  };
  






  useEffect(() => {
    let rows = document.querySelectorAll('.amount');
    let sum = 0;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].className === 'amount') {
        sum += isNaN(rows[i].innerHTML) ? 0 : parseInt(rows[i].innerHTML);
        setTotal(sum);
      }
    }
  }, [setTotal]);

  const deleteRow = (id) => {
    setList(list.filter((row) => row.id !== id));
    setTotal(0);
  };

  useEffect(() => {
    let sum = 0;
    for (const item of list) {
      sum += item.amount;
    }
    setTotal(sum);
  }, [list]);

  const editRow = (id) => {
    const editingRow = list.find((row) => row.id === id);
    setList(list.filter((row) => row.id !== id));
    setIsEditing(true);
    setDescription(editingRow.description);
    setQuantity(editingRow.quantity);
    setPrice(editingRow.price);
  };

  const calculateAmount = (quantity, price) => {
    return quantity * price;
  };

  const calculateGST = (amount) => {
    return amount * selectedGSTRate;
  };

  const calculateCGST = (gstAmount) => {
    return gstAmount / 2;
  };

  const calculateSGST = (gstAmount) => {
    return gstAmount / 2;
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description && !quantity && !price) {
      alert('Please fill in all input');
    } else {
      const amount = calculateAmount(quantity, price);
      const gstAmount = calculateGST(amount);
      const cgst = calculateCGST(gstAmount);
      const sgst = calculateSGST(gstAmount);

      const newItems = {
        id: uuidv4(),
        description,
        quantity,
        price,
        amount: amount + gstAmount,
        cgst,
        sgst,
      };
      

      setDescription('');
      setQuantity('');
      setPrice('');
      setList([...list, newItems]);
      setIsEditing(false);
    }
  };


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="description">Item description</label>
          <input
            type="text"
            name="description"
            id="description"
            placeholder="description"
            autoComplete="off"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="quantity">quantity</label>
          <input
            type="text"
            name="quantity"
            id="quantity"
            placeholder="quantity"
            autoComplete="off"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="price">Price</label>
          <input
            type="text"
            name="price"
            id="price"
            placeholder="price"
            autoComplete="off"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="gstRate">Select GST Rate:</label>
          <select
            name="gstRate"
            id="gstRate"
            value={selectedGSTRate}
            onChange={(e) => setSelectedGSTRate(parseFloat(e.target.value))}
          >
            {gstRates.map((rate) => (
              <option key={rate} value={rate}>
                {`${(rate * 100).toFixed(2)}%`}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="Amout">Amount</label>
          {/* <input
                    type="text"
                    name="Amount"
                    id="Amount"
                    placeholder="Amount"
                    autoComplete="off"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  /> */}
          {amount}
        </div>

      <button
        type="submit"
        className="bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 border-blue-500
        hover:bg-transparent hover:text-blue-500 transition-all duration-300 user-select-none"
      >
       {isEditing ? "Editing Row Item":" Add Item"}
      </button>
    </form>
      {/* <ul>
        {
          list.map(({ id, description, price, amount, quantity }) => (
            <React.Fragment key={id}>
              <li>{description}</li>
              <li>{quantity}</li>
              <li>{price}</li>
              <li>{amount}</li>
            </React.Fragment>
          ))
        }
      </ul> */}
      
       <table className='w-[1520px]'>
        <React.Fragment>
        <thead>
          <tr className='bg-gray-100 p-1'>
            <td className='font-bold'>Description</td>
            <td className='font-bold'>Quantity</td>
            <td className='font-bold'>Price</td>
            <td className='font-bold'>Amount</td>
            <td className='font-bold'>CGST</td>
            <td className='font-bold'>SGST</td>
            <td className='font-bold'>Actions</td>
          </tr>
        </thead>
        <tbody className='w-[100%]'>
          {list.map(({ id, description, price, amount, quantity, cgst, sgst }) => (
            <tr key={id}>
              <td>{description}</td>
              <td>{quantity}</td>
              <td>{price}</td>
              <td className='amount'>{amount}</td>
              <td>{cgst}</td>
              <td>{sgst}</td>
              <td className='w-[20px]'><button onClick={() => deleteRow(id)}><AiOutlineDelete /></button></td>
              <td><button onClick={() => editRow(id)}> <AiOutlineEdit /></button></td>
            </tr>
          ))}
        </tbody>

        </React.Fragment>
      </table>
      <div>
        <h2 className='text-gray-800 text-4xl'>{total.toLocaleString()}</h2>
      </div>

      <div>
     <h2>Razorpay Payment Integration Using React</h2>
     <br/>
     <input type="text"placeholder='Enter Amount'value={amount1}onChange={(e)=>setamount1(e.target.value)} />
     <br/><br/>
    
     <div>
     <button onClick={handleSubmit1} className='bg-blue-500 text-white font-bold py-2 px-8   rounded shadow  boder-2  boder-blue-500
        hover:bg-transparent hover:text-blue-500 transition-all duration-300 user-select-none'>submit</button>
           </div>
           <br/><br/>
    </div>
    </div>
  )
}

export default TableForm