{/* Action Buttons */}
<Grid item xs={12}>
  <Divider sx={{ my: 4, borderColor: 'rgba(25, 118, 210, 0.2)' }} />
  <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 2 }}>
    <Button
      variant="outlined"
      onClick={handleCancel}
      startIcon={<CancelIcon />}
      sx={{
        borderRadius: 3,
        px: 6,
        py: 2,
        borderColor: '#e0e0e0',
        color: '#666666',
        fontSize: '1.1rem',
        fontWeight: 600,
        fontFamily: 'Inter, Roboto, sans-serif',
        minWidth: 180,
        backgroundColor: '#ffffff',
        border: '2px solid #e0e0e0',
        '&:hover': {
          borderColor: '#1976d2',
          backgroundColor: '#f8f9ff',
          color: '#1976d2',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)'
        },
        transition: 'all 0.3s ease'
      }}
    >
      Cancel
    </Button>
    <Button
      type="submit"
      variant="contained"
      disabled={saving}
      startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
      sx={{
        borderRadius: 3,
        px: 6,
        py: 2,
        background: 'linear-gradient(135deg, #1976d2, #00bcd4)',
        fontSize: '1.1rem',
        fontWeight: 600,
        fontFamily: 'Inter, Roboto, sans-serif',
        minWidth: 180,
        boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
        '&:hover': {
          background: 'linear-gradient(135deg, #1565c0, #0097a7)',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 30px rgba(25, 118, 210, 0.4)'
        },
        '&:disabled': {
          background: '#cccccc',
          color: '#999999',
          boxShadow: 'none'
        },
        transition: 'all 0.3s ease'
      }}
    >
      {saving ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Add Vehicle')}
    </Button>
  </Box>
</Grid>


export default VehicleFormModern