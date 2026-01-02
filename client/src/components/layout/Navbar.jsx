import { userState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, Menu, X, Store, Search } from 'lucide-react';
import { logoutUser } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';