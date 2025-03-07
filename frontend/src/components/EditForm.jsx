import  { useState } from "react"
import { Typography } from "@mui/material"
import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import InputAdornment from "@mui/material/InputAdornment"
import TextField from "@mui/material/TextField"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { useWorkoutsContext } from "../hooks/useWorkoutContext"
import { useAuthContext } from "../hooks/useAuthContext"
import { baseURL }  from "../url"

const theme = createTheme({
	components: {
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
						borderColor: "black",
					},
				},
			},
		},
		MuiInputLabel: {
			styleOverrides: {
				root: {
					"&.Mui-focused": {
						color: "black",
					},
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				outlined: {
					color: "black",
					borderColor: "black",
					"&:hover": {
						backgroundColor: "black",
						color: "white",
						borderColor: "white",
					},
				},
			},
		},
	},
})

function EditForm({ workout, setIsEditFormVisible }) {
	const [title, setTitle] = useState(workout.title)
	const [reps, setReps] = useState(workout.reps)
	const [load, setLoad] = useState(workout.load)
	const [error, setError] = useState("")
	const [isEmpty, setIsEmpty] = useState(false)

	const { dispatch } = useWorkoutsContext()
	const { user } = useAuthContext()

	const handleSubmit = async (e) => {
		e.preventDefault()

		// Check if the user is logged in
		if (!user || !user.token) {
			setError("You must be logged in first")
			return
		}

		// Check for empty fields
		if (!title || !reps || !load) {
			setIsEmpty(true)
			return
		}

		const SubmitWorkout = { title, reps, load }

		// Send the PATCH request to update the workout
		const response = await fetch(`${baseURL}/api/workouts/${workout._id}`, {
			method: "PATCH",
			body: JSON.stringify(SubmitWorkout),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.token}`,
			},
		})

		const data = await response.json()

		// Handle errors
		if (!response.ok) {
			setError(data.err.message)
		}

		// If successful, dispatch the updated workout and reset form
		if (response.ok) {
			dispatch({ type: "EDIT_WORKOUT", payload: data.workout })
			setTitle("")
			setLoad("")
			setReps("")
			setError(null)
			setIsEmpty(false)
			setIsEditFormVisible(false)
			console.log("workout edited")
		}
	}

	return (
		<div className="bg-white w-full h-[500px] rounded-md p-4">
			<ThemeProvider theme={theme}>
				<form onSubmit={handleSubmit}>
					<div className="flex flex-col my-">
						<Typography variant="h4">
							<Box sx={{ fontStyle: "italic", mb: 2 }}>Edit Workout</Box>
						</Typography>
						<TextField
							id="outlined-basic"
							label="Exercise"
							variant="outlined"
							sx={{ my: 2 }}
							onChange={(e) => setTitle(e.target.value)}
							value={title}
							error={isEmpty && !title}
							helperText={isEmpty && !title ? "Please fill in this field" : ""}
						/>
						<TextField
							id="outlined-basic"
							label="Reps"
							variant="outlined"
							type="number"
							sx={{ my: 2 }}
							onChange={(e) => setReps(e.target.value)}
							value={reps}
							error={isEmpty && !reps}
							helperText={isEmpty && !reps ? "Please fill in this field" : ""}
						/>
						<TextField
							id="outlined-basic"
							label="Load"
							variant="outlined"
							type="number"
							InputProps={{
								endAdornment: <InputAdornment position="end">kg</InputAdornment>,
							}}
							sx={{ my: 2 }}
							onChange={(e) => setLoad(e.target.value)}
							value={load}
							error={isEmpty && !load}
							helperText={isEmpty && !load ? "Please fill in this field" : ""}
						/>
					</div>
					<Button type="submit" variant="outlined">
						Update Workout
					</Button>
					{/* Show error message if form is incomplete or user is not logged in */}
					{(isEmpty || error) && (
						<div className="mt-4">
							<Alert variant="outlined" severity="error">
								{isEmpty ? "Please fill in all the details" : error}
							</Alert>
						</div>
					)}
				</form>
			</ThemeProvider>
		</div>
	)
}

export default EditForm
