FROM tiangolo/uvicorn-gunicorn-fastapi:python3.11

WORKDIR /code/backend

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=/opt/poetry python && \
    cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry && \
    poetry config virtualenvs.create false

# Copy poetry related files
COPY ./pyproject.toml ./poetry.lock* /code/backend/

# Copy the content of the backend directory
COPY ./src /code/backend/src
COPY ./alembic.ini /code/backend/alembic.ini
COPY ./alembic /code/backend/alembic
COPY ./prestart.py /code/backend/prestart.py
COPY ./start.sh /code/backend/start.sh

# Install dependencies
RUN poetry install --no-dev --no-root

# Make start.sh executable
RUN chmod +x /code/backend/start.sh

ENV PYTHONPATH=/code/backend
ENTRYPOINT ["/code/backend/start.sh"]
CMD ["-p"]
