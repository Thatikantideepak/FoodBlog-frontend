import React, { useEffect, useState } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
// note: image import removed because the image is now referenced via API endpoint
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

export default function RecipeItems() {
    const recipes = useLoaderData()
    const [allRecipes, setAllRecipes] = useState()
    let path = window.location.pathname === "/myRecipe" ? true : false
    const [favItems, setFavItems] = useState(() => JSON.parse(localStorage.getItem("fav")) ?? [])
    const navigate=useNavigate()
    console.log(allRecipes)
    const token = localStorage.getItem('token')
    const localUser = JSON.parse(localStorage.getItem('user') || 'null')
    const userId = localUser?._id

    useEffect(() => {
        setAllRecipes(recipes)
    }, [recipes])

    // if no loader data, fetch recipes from API
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                if (!recipes) {
                    const res = await axios.get(API_ENDPOINTS.GET_RECIPES)
                    setAllRecipes(res.data)
                }
            } catch (err) {
                console.error('Failed to fetch recipes', err)
            }
        }
        fetchRecipes()
    }, [recipes])

    // fetch favourites for authenticated user; fallback to localStorage for guests
    useEffect(() => {
        const fetchFavs = async () => {
            try {
                if (token && userId) {
                    const res = await axios.get(API_ENDPOINTS.GET_USER_FAVS(userId), {
                        headers: { Authorization: 'Bearer ' + token }
                    })
                    // server returns populated recipe objects
                    setFavItems(res.data.favourites || [])
                    localStorage.setItem('fav', JSON.stringify(res.data.favourites || []))
                } else {
                    // keep existing localStorage-based favs
                    const local = JSON.parse(localStorage.getItem('fav')) ?? []
                    setFavItems(local)
                }
            } catch (err) {
                console.error('Failed to fetch favourites', err)
            }
        }
        fetchFavs()
    }, [token, userId])

    const onDelete = async (id) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                alert('You must be logged in to delete a recipe.')
                return
            }
            await axios.delete(API_ENDPOINTS.DELETE_RECIPE(id), {
                headers: { Authorization: 'Bearer ' + token }
            })
            setAllRecipes(recipes => recipes.filter(recipe => recipe._id !== id))
            // also remove from favourites state + localStorage
            setFavItems(prev => {
                const next = prev.filter(recipe => recipe._id !== id)
                localStorage.setItem("fav", JSON.stringify(next))
                return next
            })
        } catch (error) {
            console.error("Failed to delete recipe:", error)
            // show more helpful message when backend returns 401
            if (error.response && error.response.status === 401) {
                alert('Unauthorized: please log in again before deleting recipes.')
            } else {
                alert("Failed to delete recipe. Please try again.")
            }
        }
    }

    const favRecipe = async (item) => {
        const exists = favItems.some(recipe => recipe._id === item._id)
        // logged in: persist to server
        if (token && userId) {
            try {
                if (exists) {
                    const res = await axios.delete(API_ENDPOINTS.REMOVE_FAV(userId, item._id), {
                        headers: { Authorization: 'Bearer ' + token }
                    })
                    setFavItems(res.data.favourites || [])
                    localStorage.setItem('fav', JSON.stringify(res.data.favourites || []))
                } else {
                    const res = await axios.post(API_ENDPOINTS.ADD_FAV(userId), { recipeId: item._id }, {
                        headers: { Authorization: 'Bearer ' + token }
                    })
                    setFavItems(res.data.favourites || [])
                    localStorage.setItem('fav', JSON.stringify(res.data.favourites || []))
                }
            } catch (err) {
                console.error('Failed to update favourite on server', err)
                alert('Failed to update favourite. Please try again.')
            }
        } else {
            // guest: localStorage fallback
            setFavItems(prev => {
                const next = exists ? prev.filter(recipe => recipe._id !== item._id) : [...prev, item]
                localStorage.setItem("fav", JSON.stringify(next))
                return next
            })
        }
    }

    return (
        <>
            <div className='card-container'>
                {
                    allRecipes?.map((item, index) => {
                        return (
                            <div key={index} className='card'onDoubleClick={()=>navigate(`/recipe/${item._id}`)}>
                                <img src={API_ENDPOINTS.IMAGE_URL(item.coverImage)} width="120px" height="100px"></img>
                                <div className='card-body'>
                                    <div className='title'>{item.title}</div>
                                    <div className='icons'>
                                        <div className='timer'><BsStopwatchFill />{item.time}</div>
                                        {(!path) ? (
                                            // show favourite heart only for authenticated users
                                            (userId) ? <FaHeart onClick={() => favRecipe(item)}
                                                style={{ color: (favItems.some(res => res._id === item._id)) ? "red" : "" }} /> : null
                                        ) :
                                            <div className='action'>
                                                <Link to={`/editRecipe/${item._id}`} className="editIcon"><FaEdit /></Link>
                                                <MdDelete onClick={() => onDelete(item._id)} className='deleteIcon' />
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}
