import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_ENDPOINTS } from '../config/api'

export default function AddFoodRecipe() {
    const [recipeData, setRecipeData] = useState({})
    const navigate = useNavigate()
    const onHandleChange = (e) => {
        let val = (e.target.name === "ingredients") ? e.target.value.split(",") : (e.target.name === "file") ? e.target.files[0] : e.target.value
        setRecipeData(pre => ({ ...pre, [e.target.name]: val }))
    }
    const onHandleSubmit = async (e) => {
        e.preventDefault()
        console.log(recipeData)
        try {
            const formData = new FormData()
            // Append simple fields
            if (recipeData.title) formData.append('title', recipeData.title)
            if (recipeData.time) formData.append('time', recipeData.time)
            if (recipeData.instructions) formData.append('instructions', recipeData.instructions)
            // Ingredients may be stored as array or comma-separated string
            if (Array.isArray(recipeData.ingredients)) {
                formData.append('ingredients', recipeData.ingredients.join(','))
            } else if (recipeData.ingredients) {
                formData.append('ingredients', recipeData.ingredients)
            }
            // File (if present)
            if (recipeData.file) {
                formData.append('file', recipeData.file)
            }

            await axios.post(API_ENDPOINTS.CREATE_RECIPE, formData, {
                headers: {
                    // Let the browser/axios set Content-Type including boundary
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            navigate("/")
        } catch (error) {
            console.error("Failed to add recipe:", error)
            alert("Failed to add recipe. Please try again.")
        }
    }
    return (
        <>
            <div className='container'>
                <form className='form' onSubmit={onHandleSubmit}>
                    <div className='form-control'>
                        <label>Title</label>
                        <input type="text" className='input' name="title" onChange={onHandleChange}></input>
                    </div>
                    <div className='form-control'>
                        <label>Time</label>
                        <input type="text" className='input' name="time" onChange={onHandleChange}></input>
                    </div>
                    <div className='form-control'>
                        <label>Ingredients</label>
                        <textarea type="text" className='input-textarea' name="ingredients" rows="5" onChange={onHandleChange}></textarea>
                    </div>
                    <div className='form-control'>
                        <label>Instructions</label>
                        <textarea type="text" className='input-textarea' name="instructions" rows="5" onChange={onHandleChange}></textarea>
                    </div>
                    <div className='form-control'>
                        <label>Recipe Image</label>
                        <input type="file" className='input' name="file" onChange={onHandleChange}></input>
                    </div>
                    <button type="submit">Add Recipe</button>
                </form>
            </div>
        </>
    )
}
