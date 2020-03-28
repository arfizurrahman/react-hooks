import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import ErrorModal from "../UI/ErrorModal";
import "./Search.css";
import useHttp from "../../hooks/http";
import LoadingIndicator from "../UI/LoadingIndicator";

const Search = React.memo(props => {
	const { onLoadIngredients } = props;
	const [enteredFilter, setEnteredFilter] = useState("");
	const inputRef = useRef();
	const { isLoading, error, sendRequest, data, clear } = useHttp();

	useEffect(() => {
		const timer = setTimeout(() => {
			if (enteredFilter === inputRef.current.value) {
				const queryParams =
					enteredFilter.length === 0
						? ""
						: `?orderBy="title"&equalTo="${enteredFilter}"`;
				sendRequest(
					"https://react-hooks-58436.firebaseio.com/ingredients.json" +
						queryParams,
					"GET"
				);
			}
		}, 500);
		return () => {
			clearTimeout(timer);
		};
	}, [enteredFilter, inputRef, sendRequest]);

	useEffect(() => {
		if (!isLoading && !error && data) {
			const loadedIngredients = [];
			for (const key in data) {
				loadedIngredients.push({
					id: key,
					title: data[key].title,
					amount: data[key].amount
				});
			}
			onLoadIngredients(loadedIngredients);
		}
	}, [data, isLoading, error, onLoadIngredients]);

	return (
		<section className='search'>
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
			<Card>
				<div className='search-input'>
					<label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
					<input
						ref={inputRef}
						type='text'
						value={enteredFilter}
						onChange={event => setEnteredFilter(event.target.value)}
					/>
				</div>
			</Card>
		</section>
	);
});

export default Search;
