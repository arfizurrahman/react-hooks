import React, { useReducer, useEffect, useCallback, useMemo } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";
import useHttp from "../../hooks/http";

const ingredientReducer = (currentIngredients, action) => {
	switch (action.type) {
		case "SET":
			return action.ingredients;
		case "ADD":
			return [...currentIngredients, action.ingredient];
		case "DELETE":
			return currentIngredients.filter(ing => ing.id !== action.id);
		default:
			throw new Error("Should not get there");
	}
};

const Ingredients = () => {
	const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
	const { isLoading, error, data, sendRequest, reqExtra, reqIentifier, clear } = useHttp();

	useEffect(() => {
		if (!isLoading && !error && reqIentifier === 'REMOVE') {
			dispatch({ type: "DELETE", id: reqExtra });
		} else if(!isLoading && !error && reqIentifier === 'ADD') {
			dispatch({
				type: "ADD",
				ingredient: { id: data.name, ...reqExtra }
			});
		}
	}, [data, reqExtra, error, isLoading, reqIentifier]);

	const filteredIngredientsHandler = useCallback(filteredIngredients => {
		dispatch({ type: "SET", ingredients: filteredIngredients });
	}, []);

	const addIngredientHandler = useCallback(ingredient => {
		sendRequest(
			"https://react-hooks-58436.firebaseio.com/ingredients.json",
			"POST",
      JSON.stringify(ingredient),
      ingredient,
      'ADD'
		);
	}, [sendRequest]);

	const removeIngredientHandler = useCallback(
		id => {
			sendRequest(
				`https://react-hooks-58436.firebaseio.com/ingredients/${id}.json`,
				"DELETE",
				null,
        id,
        'REMOVE'
			);
		},
		[sendRequest]
	);
	const ingredientList = useMemo(() => {
		return (
			<IngredientList
				ingredients={userIngredients}
				onRemoveItem={removeIngredientHandler}
			/>
		);
	}, [userIngredients, removeIngredientHandler]);
	return (
		<div className='App'>
			{error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
			<IngredientForm
				onAddIngredient={addIngredientHandler}
				loading={isLoading}
			/>

			<section>
				<Search onLoadIngredients={filteredIngredientsHandler} />
				{ingredientList}
			</section>
		</div>
	);
};

export default Ingredients;

// const [userIngredients, setUserIngredients] = useState([]);
// const [isLoading, setIsLoading] = useState(false);
// const [error, setError] = useState();

// useEffect(() => {
//     fetch("https://react-hooks-58436.firebaseio.com/ingredients.json")
//         .then(response => response.json())
//         .then(responseData => {
//             const loadedIngredients = [];
//             for (const key in responseData) {
//                 loadedIngredients.push({
//                     id: key,
//                     title: responseData[key].title,
//                     amount: responseData[key].amount
//                 });
//             }
//             setUserIngredients(loadedIngredients);
//         });
// }, []);

// const removeIngredientHandler = useCallback(id => {
//   dispatchHttp({ type: "SEND" });
//   fetch(
//     `https://react-hooks-58436.firebaseio.com/ingredients/${id}.json`,
//     {
//       method: "DELETE"
//     }
//   )
//     .then(response => {
//       dispatchHttp({ type: "RESPONSE" });
//       // setUserIngredients(prevIngredients =>
//       //     prevIngredients.filter(i => i.id !== id)
//       // );
//       dispatch({ type: "DELETE", id: id });
//     })
//     .catch(error => {
//       dispatchHttp({
//         type: "ERROR",
//         errorMessage: "Something went wrong"
//       });
//       // setError("Something went wrong!");
//       // setIsLoading(false);
//     });
// }, []);
