import React, { useState, useReducer, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

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
	// const [userIngredients, setUserIngredients] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();

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

	useEffect(() => {
		console.log("Rendering ingredients");
	}, [userIngredients]);

	const filteredIngredientsHandler = useCallback(filteredIngredients => {
		// setUserIngredients(filteredIngredients);
		dispatch({ type: "SET", ingredients: filteredIngredients });
	}, []);

	const addIngredientHandler = ingredient => {
		setIsLoading(true);
		fetch("https://react-hooks-58436.firebaseio.com/ingredients.json", {
			method: "POST",
			body: JSON.stringify(ingredient),
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(response => {
				setIsLoading(false);
				return response.json();
			})
			.then(responseData => {
				// setUserIngredients(prevIngredients => [
				//     ...prevIngredients,
				//     { id: responseData.name, ...ingredient }
				// ]);
				dispatch({
					type: "ADD",
					ingredient: { id: responseData.name, ...ingredient }
				});
			});
	};

	const removeIngredientHandler = id => {
		setIsLoading(true);
		fetch(
			`https://react-hooks-58436.firebaseio.com/ingredients/${id}.json`,
			{
				method: "DELETE"
			}
		)
			.then(response => {
				setIsLoading(false);
				// setUserIngredients(prevIngredients =>
				//     prevIngredients.filter(i => i.id !== id)
				// );
				dispatch({ type: "DELETE", id: id });
			})
			.catch(error => {
				setError("Something went wrong!");
				setIsLoading(false);
			});
	};
	const clearError = () => {
		setError(null);
	};
	return (
		<div className='App'>
			{error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
			<IngredientForm
				onAddIngredient={addIngredientHandler}
				loading={isLoading}
			/>

			<section>
				<Search onLoadIngredients={filteredIngredientsHandler} />
				<IngredientList
					ingredients={userIngredients}
					onRemoveItem={id => removeIngredientHandler(id)}
				/>
			</section>
		</div>
	);
};

export default Ingredients;
