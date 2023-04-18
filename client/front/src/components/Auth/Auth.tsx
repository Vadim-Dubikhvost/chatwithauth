import React from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { API } from '../../api/api'
import { Box, Button, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { IData, IResponse } from '../../interfaces/interfaces'


const schema = yup.object().shape({
	username: yup.string().required(),
	password: yup.string().required().min(5).max(11)
})

const useStyles = makeStyles({
	form: {
		display: "flex",
		justifyContent: "center",
		flexDirection: "column",
		width: "500px",
		margin: "0 auto",
		marginTop: "100px",
	},
	input: {
		marginBottom: "35px",
		borderRadius: "10px",
		height: "30px",

		textAlign: "center",
		fontSize: "18px",
	},
	loginBtn: {
		background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
		border: 0,
		borderRadius: 3,
		boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
		color: 'white',
		height: 48,
		padding: '0 30px',
	},
	error: {
		color: "red",
		textTransform: "uppercase",
		fontSize: "18px",
		fontWeight: "bold",
		textAlign: "center",
		marginTop: "10px",
	}
}
)

interface AuthProps {
	setIsAuthed(isAuthed: boolean): void;
	setUsername(username: string): void;
}

const Auth: React.FC<AuthProps> = ({ setIsAuthed, setUsername, ...props }) => {
	const { register, handleSubmit, formState: { errors }, reset } = useForm<any>({ resolver: yupResolver(schema) })

	const classes = useStyles()

	const onSubmit = async (data: IData): Promise<void> => {
		const loginResponse: IResponse = await API.login(data.username, data.password)

		if (loginResponse.status === 1) {
			const regResponse: IResponse = await API.regNewUser(data.username, data.password)
			if (regResponse.status === 0) {
				await API.login(data.username, data.password).then(
					response => {
						if (response.status === 0) {
							window.localStorage.setItem('token', response.token as string)
							setIsAuthed(true)
							setUsername(response.username as string)
						}
					}
				)
			}
		} else {
			window.localStorage.setItem('token', loginResponse.token as string)
			setIsAuthed(true)
			setUsername(loginResponse.username as string)
		}
		reset()
	}

	return (
		<>
			<Box component="form"
				className={classes.form}
				onSubmit={handleSubmit(onSubmit)}
			>
				<TextField id="outlined-basic" {...register('username')} label="Username" variant="outlined" className={classes.input}
					error={errors.username ? true : false} />
				<TextField id="outlined-basic2" {...register('password')} label="Password" variant="outlined" type="password"
					onSubmit={handleSubmit(onSubmit)} className={classes.input} error={errors.password ? true : false} />
				<Button id="button-basic" type="submit" onSubmit={handleSubmit(onSubmit)} className={classes.loginBtn}> Login</Button>
				<div className={classes.error}>{errors.username?.message}</div>
				<div className={classes.error}>{errors.password?.message}</div>
			</Box>
		</>
	)
}



export default Auth