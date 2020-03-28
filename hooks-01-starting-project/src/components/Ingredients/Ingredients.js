import React, { useState } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const Ingredients = () => {
    const [userIngredients, setUserIngredients] = useState([]);

    const addIngredientHandler = ingredient => {
        fetch("https://react-hooks-58436.firebaseio.com//ingredients.json", {
            method: "POST",
            body: JSON.stringify({ ingredient }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            return response.json();
        })
        .then(responseData => {
            setUserIngredients(prevIngredients => [
                ...prevIngredients,
                { id: responseData.name, ...ingredient }
            ]);
        });
    };

    const removeIngredientHandler = id => {
        setUserIngredients(prevIngredients =>
            prevIngredients.filter(i => i.id !== id)
        );
    };

    return (
        <div className="App">
            <IngredientForm onAddIngredient={addIngredientHandler} />

            <section>
                <Search />
                <IngredientList
                    ingredients={userIngredients}
                    onRemoveItem={id => removeIngredientHandler(id)}
                />
            </section>
        </div>
    );
};

export default Ingredients;
