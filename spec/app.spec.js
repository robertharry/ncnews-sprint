process.env.NODE_ENV = 'test';
const chai = require('chai');
const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection');

